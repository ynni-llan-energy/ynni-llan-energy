import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// ─── Auth.js (NextAuth v5) adapter tables ──────────────────────────────────
// Column shapes follow @auth/drizzle-adapter's Postgres defaults, except
// `id`/`userId` are `uuid` (not `text`) so existing Supabase auth.users UUIDs
// can be preserved and the `members` FK below type-matches without a cast.

export const users = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ]
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
);

// ─── App tables ─────────────────────────────────────────────────────────────
// Mirrors supabase/migrations/*.sql. members.id is the same UUID as the
// member's users.id (1:1), preserving the identity link the Supabase
// `auth.users` -> `public.members` trigger used to maintain.

export const members = pgTable("members", {
  id: uuid("id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  status: text("status", {
    enum: ["pending", "active", "suspended", "expired"],
  })
    .notNull()
    .default("pending"),
  eligibleToVote: boolean("eligible_to_vote").notNull().default(false),
  postcode: text("postcode"),
  joinedAt: timestamp("joined_at", { withTimezone: true }),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  approvedBy: uuid("approved_by"),
  isAdmin: boolean("is_admin").notNull().default(false),
  membershipExpiresAt: timestamp("membership_expires_at", {
    withTimezone: true,
  }),
  renewalNotifiedAt: timestamp("renewal_notified_at", { withTimezone: true }),
  policyConsentAt: timestamp("policy_consent_at", { withTimezone: true }),
});

export const roleInterest = pgTable("role_interest", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  roleSlug: text("role_slug").notNull(),
  roleTitle: text("role_title").notNull(),
  memberId: uuid("member_id")
    .notNull()
    .references(() => members.id, { onDelete: "cascade" }),
  statement: text("statement"),
});

export const emailSends = pgTable("email_sends", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  template: text("template").notNull(),
  subject: text("subject").notNull(),
  recipientCount: integer("recipient_count").notNull().default(0),
  triggeredBy: uuid("triggered_by")
    .notNull()
    .references(() => members.id),
  sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Voting (schema-only carryover) ─────────────────────────────────────────
// Defined in Supabase but never called from app code (grepped `src/` for
// `.from("ballots"|"ballot_options"|"votes")` — no hits). Carried forward as
// plain tables for future use; the RLS-enforced eligibility/ballot-window
// checks from supabase/migrations/20260407000001 are NOT reimplemented here,
// since no app-layer authorization currently depends on them. Whoever builds
// the voting feature must add that authorization at the point of the vote
// INSERT — do not assume the DB enforces it any more.

export const ballots = pgTable("ballots", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  titleCy: text("title_cy").notNull(),
  titleEn: text("title_en").notNull(),
  descriptionCy: text("description_cy"),
  descriptionEn: text("description_en"),
  status: text("status", { enum: ["draft", "open", "closed"] })
    .notNull()
    .default("draft"),
  opensAt: timestamp("opens_at", { withTimezone: true }).notNull(),
  closesAt: timestamp("closes_at", { withTimezone: true }).notNull(),
  quorum: integer("quorum"),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => members.id),
});

export const ballotOptions = pgTable("ballot_options", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  ballotId: uuid("ballot_id")
    .notNull()
    .references(() => ballots.id, { onDelete: "cascade" }),
  labelCy: text("label_cy").notNull(),
  labelEn: text("label_en").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const votes = pgTable("votes", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  ballotId: uuid("ballot_id")
    .notNull()
    .references(() => ballots.id),
  memberId: uuid("member_id")
    .notNull()
    .references(() => members.id),
  optionId: uuid("option_id")
    .notNull()
    .references(() => ballotOptions.id),
  votedAt: timestamp("voted_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
