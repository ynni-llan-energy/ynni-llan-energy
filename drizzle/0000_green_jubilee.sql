CREATE TABLE "account" (
	"userId" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "ballot_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ballot_id" uuid NOT NULL,
	"label_cy" text NOT NULL,
	"label_en" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ballots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"title_cy" text NOT NULL,
	"title_en" text NOT NULL,
	"description_cy" text,
	"description_en" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"opens_at" timestamp with time zone NOT NULL,
	"closes_at" timestamp with time zone NOT NULL,
	"quorum" integer,
	"created_by" uuid NOT NULL,
	CONSTRAINT "ballots_status_check" CHECK ("ballots"."status" IN ('draft', 'open', 'closed'))
);
--> statement-breakpoint
CREATE TABLE "email_sends" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"template" text NOT NULL,
	"subject" text NOT NULL,
	"recipient_count" integer DEFAULT 0 NOT NULL,
	"triggered_by" uuid,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "members" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"email" text NOT NULL,
	"full_name" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"eligible_to_vote" boolean DEFAULT false NOT NULL,
	"postcode" text,
	"joined_at" timestamp with time zone,
	"approved_at" timestamp with time zone,
	"approved_by" uuid,
	"is_admin" boolean DEFAULT false NOT NULL,
	"membership_expires_at" timestamp with time zone,
	"renewal_notified_at" timestamp with time zone,
	"policy_consent_at" timestamp with time zone,
	CONSTRAINT "members_email_unique" UNIQUE("email"),
	CONSTRAINT "members_status_check" CHECK ("members"."status" IN ('pending', 'active', 'suspended', 'expired'))
);
--> statement-breakpoint
CREATE TABLE "role_interest" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"role_slug" text NOT NULL,
	"role_title" text NOT NULL,
	"member_id" uuid NOT NULL,
	"statement" text,
	CONSTRAINT "role_interest_role_slug_member_id_key" UNIQUE("role_slug","member_id")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "votes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ballot_id" uuid NOT NULL,
	"member_id" uuid NOT NULL,
	"option_id" uuid NOT NULL,
	"voted_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "votes_ballot_id_member_id_key" UNIQUE("ballot_id","member_id")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ballot_options" ADD CONSTRAINT "ballot_options_ballot_id_ballots_id_fk" FOREIGN KEY ("ballot_id") REFERENCES "public"."ballots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ballots" ADD CONSTRAINT "ballots_created_by_members_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_sends" ADD CONSTRAINT "email_sends_triggered_by_members_id_fk" FOREIGN KEY ("triggered_by") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_id_user_id_fk" FOREIGN KEY ("id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_approved_by_members_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_interest" ADD CONSTRAINT "role_interest_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_ballot_id_ballots_id_fk" FOREIGN KEY ("ballot_id") REFERENCES "public"."ballots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_option_id_ballot_options_id_fk" FOREIGN KEY ("option_id") REFERENCES "public"."ballot_options"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_ballots_status" ON "ballots" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_ballots_dates" ON "ballots" USING btree ("opens_at","closes_at");--> statement-breakpoint
CREATE INDEX "idx_members_status" ON "members" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_members_expires_at" ON "members" USING btree ("membership_expires_at") WHERE "members"."membership_expires_at" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "idx_members_is_admin" ON "members" USING btree ("is_admin") WHERE "members"."is_admin" = true;--> statement-breakpoint
CREATE INDEX "idx_role_interest_slug" ON "role_interest" USING btree ("role_slug");--> statement-breakpoint
CREATE INDEX "idx_role_interest_member" ON "role_interest" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "idx_votes_ballot" ON "votes" USING btree ("ballot_id");--> statement-breakpoint
CREATE INDEX "idx_votes_member" ON "votes" USING btree ("member_id");