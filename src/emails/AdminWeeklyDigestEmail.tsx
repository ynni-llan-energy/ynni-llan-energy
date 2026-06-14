import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

// ─── Brand tokens ────────────────────────────────────────────────────────────
const navy = "#0A4B68";
const cream = "#EEE8D8";
const gold = "#E09800";
const green = "#2B8050";
const amber = "#C06000";
const navyMuted = "#437284";
const navySubtle = "#658A95";
const creamMuted = "#AAB9B6";
const creamSubtle = "#7C9AA0";

const serif = "Georgia, 'Times New Roman', Times, serif";
const sans =
  "system-ui, -apple-system, 'Helvetica Neue', Helvetica, Arial, sans-serif";

// ─── Types ───────────────────────────────────────────────────────────────────
export interface DigestMember {
  fullName: string;
  email: string;
  date: string;
}

export interface ExpiringMember {
  fullName: string;
  daysRemaining: number;
}

export interface AdminWeeklyDigestEmailProps {
  /** Formatted week start date, e.g. "9 Mehefin 2026 / 9 June 2026". */
  weekStart: string;
  /** Formatted week end date. */
  weekEnd: string;
  /** URL to the admin dashboard. */
  adminUrl: string;
  /** New members who registered during the week (up to 10 shown). */
  newMembers: DigestMember[];
  /** Total new members this week (may exceed newMembers.length). */
  newMembersCount: number;
  /** Members currently awaiting admin approval (up to 10 shown). */
  pendingMembers: DigestMember[];
  /** Total pending members. */
  pendingCount: number;
  /** Total active members. */
  totalActive: number;
  /** Total expired members. */
  totalExpired: number;
  /** Total suspended members. */
  totalSuspended: number;
  /** Members with active status expiring within 30 days (up to 10 shown). */
  expiringMembers: ExpiringMember[];
  /** Total expiring within 30 days. */
  expiringCount: number;
}

// ─── Component ───────────────────────────────────────────────────────────────
export function AdminWeeklyDigestEmail({
  weekStart,
  weekEnd,
  adminUrl,
  newMembers,
  newMembersCount,
  pendingMembers,
  pendingCount,
  totalActive,
  totalExpired,
  totalSuspended,
  expiringMembers,
  expiringCount,
}: AdminWeeklyDigestEmailProps) {
  const totalAll = totalActive + pendingCount + totalExpired + totalSuspended;

  return (
    <Html lang="cy">
      <Head />
      <Preview>
        Crynodeb aelodaeth wythnosol {weekStart}–{weekEnd} —{" "}
        {newMembersCount} newydd, {pendingCount} yn aros am gymeradwyaeth
      </Preview>

      <Body style={s.body}>
        <Container style={s.container}>
          {/* ── Header ─────────────────────────────────────────────────── */}
          <Section style={s.header}>
            <Text style={s.orgName}>Ynni Cymunedol</Text>
            <Text style={s.orgSub}>Llanfairfechan</Text>
            <div style={s.goldLine} />
            <Text style={s.headerLabel}>
              Crynodeb Gweinyddol Wythnosol &middot;{" "}
              <em>Weekly Admin Digest</em>
            </Text>
            <Text style={s.headerDates}>
              {weekStart} – {weekEnd}
            </Text>
          </Section>

          {/* ── Content ────────────────────────────────────────────────── */}
          <Section style={s.content}>
            {/* ── Membership totals ──────────────────────────────────── */}
            <Heading as="h2" style={s.sectionHeadingCy}>
              Cyfanswm Aelodaeth
            </Heading>
            <Text style={s.sectionHeadingEn}>Membership Totals</Text>

            <Row style={s.statRow}>
              <Column style={s.statCell}>
                <Text style={s.statNumber}>{totalActive}</Text>
                <Text style={s.statLabelCy}>Gweithredol</Text>
                <Text style={s.statLabelEn}>Active</Text>
              </Column>
              <Column style={s.statCell}>
                <Text style={{ ...s.statNumber, color: amber }}>
                  {pendingCount}
                </Text>
                <Text style={s.statLabelCy}>Yn Aros</Text>
                <Text style={s.statLabelEn}>Pending</Text>
              </Column>
              <Column style={s.statCell}>
                <Text style={{ ...s.statNumber, color: navyMuted }}>
                  {totalExpired}
                </Text>
                <Text style={s.statLabelCy}>Wedi Dod i Ben</Text>
                <Text style={s.statLabelEn}>Expired</Text>
              </Column>
              <Column style={s.statCell}>
                <Text style={{ ...s.statNumber, color: navySubtle }}>
                  {totalSuspended}
                </Text>
                <Text style={s.statLabelCy}>Wedi'i Atal</Text>
                <Text style={s.statLabelEn}>Suspended</Text>
              </Column>
            </Row>

            <Section style={s.totalBadge}>
              <Text style={s.totalBadgeText}>
                {totalAll} aelod i gyd &middot; <em>{totalAll} members total</em>
              </Text>
            </Section>

            <Hr style={s.divider} />

            {/* ── New registrations ──────────────────────────────────── */}
            <Heading as="h2" style={s.sectionHeadingCy}>
              Cofrestriadau Newydd yr Wythnos
            </Heading>
            <Text style={s.sectionHeadingEn}>New Registrations This Week</Text>

            {newMembersCount === 0 ? (
              <Section style={s.emptyBox}>
                <Text style={s.emptyText}>
                  Dim cofrestriadau newydd yr wythnos hon.
                </Text>
                <Text style={s.emptyTextEn}>
                  No new registrations this week.
                </Text>
              </Section>
            ) : (
              <>
                <Section style={s.countBadge}>
                  <Text style={s.countBadgeText}>
                    {newMembersCount}{" "}
                    {newMembersCount === 1
                      ? "aelod newydd / new member"
                      : "aelod newydd / new members"}
                  </Text>
                </Section>
                {newMembers.map((m, i) => (
                  <Section key={i} style={s.memberRow}>
                    <Text style={s.memberName}>{m.fullName}</Text>
                    <Text style={s.memberEmail}>
                      {m.email} &middot; {m.date}
                    </Text>
                  </Section>
                ))}
                {newMembersCount > newMembers.length && (
                  <Text style={s.moreNote}>
                    + {newMembersCount - newMembers.length} arall /{" "}
                    <em>+ {newMembersCount - newMembers.length} more</em> —{" "}
                    gweler y panel gweinyddu /{" "}
                    <em>see the admin panel</em>
                  </Text>
                )}
              </>
            )}

            <Hr style={s.divider} />

            {/* ── Pending approval ───────────────────────────────────── */}
            <Heading as="h2" style={s.sectionHeadingCy}>
              Yn Aros am Gymeradwyaeth
            </Heading>
            <Text style={s.sectionHeadingEn}>Awaiting Approval</Text>

            {pendingCount === 0 ? (
              <Section style={s.emptyBox}>
                <Text style={s.emptyText}>
                  Does dim aelodau yn aros am gymeradwyaeth.
                </Text>
                <Text style={s.emptyTextEn}>
                  No members awaiting approval.
                </Text>
              </Section>
            ) : (
              <>
                <Section style={{ ...s.countBadge, backgroundColor: `${amber}18`, borderColor: `${amber}50` }}>
                  <Text style={{ ...s.countBadgeText, color: amber }}>
                    {pendingCount}{" "}
                    {pendingCount === 1
                      ? "aelod yn aros / member awaiting approval"
                      : "aelod yn aros / members awaiting approval"}
                  </Text>
                </Section>
                {pendingMembers.map((m, i) => (
                  <Section key={i} style={s.memberRow}>
                    <Text style={s.memberName}>{m.fullName}</Text>
                    <Text style={s.memberEmail}>
                      {m.email} &middot; Ymunwyd / Joined: {m.date}
                    </Text>
                  </Section>
                ))}
                {pendingCount > pendingMembers.length && (
                  <Text style={s.moreNote}>
                    + {pendingCount - pendingMembers.length} arall /{" "}
                    <em>+ {pendingCount - pendingMembers.length} more</em>
                  </Text>
                )}
                <Section style={s.buttonWrap}>
                  <Button href={adminUrl} style={s.button}>
                    Adolygu ceisiadau / Review applications
                  </Button>
                </Section>
              </>
            )}

            <Hr style={s.divider} />

            {/* ── Expiring soon ──────────────────────────────────────── */}
            <Heading as="h2" style={s.sectionHeadingCy}>
              Aelodaethau'n Dod i Ben yn Fuan
            </Heading>
            <Text style={s.sectionHeadingEn}>
              Memberships Expiring Within 30 Days
            </Text>

            {expiringCount === 0 ? (
              <Section style={s.emptyBox}>
                <Text style={s.emptyText}>
                  Dim aelodaethau'n dod i ben yn yr 30 diwrnod nesaf.
                </Text>
                <Text style={s.emptyTextEn}>
                  No memberships expiring in the next 30 days.
                </Text>
              </Section>
            ) : (
              <>
                <Section style={s.countBadge}>
                  <Text style={s.countBadgeText}>
                    {expiringCount}{" "}
                    {expiringCount === 1
                      ? "aelodaeth / membership"
                      : "aelodaeth / memberships"}
                  </Text>
                </Section>
                {expiringMembers.map((m, i) => (
                  <Section key={i} style={s.memberRow}>
                    <Text style={s.memberName}>{m.fullName}</Text>
                    <Text style={s.memberEmail}>
                      {m.daysRemaining}{" "}
                      {m.daysRemaining === 1 ? "diwrnod" : "diwrnod"} ar ôl /{" "}
                      <em>
                        {m.daysRemaining}{" "}
                        {m.daysRemaining === 1 ? "day" : "days"} remaining
                      </em>
                    </Text>
                  </Section>
                ))}
                {expiringCount > expiringMembers.length && (
                  <Text style={s.moreNote}>
                    + {expiringCount - expiringMembers.length} arall /{" "}
                    <em>+ {expiringCount - expiringMembers.length} more</em>
                  </Text>
                )}
              </>
            )}

            <Hr style={s.divider} />

            <Section style={s.buttonWrap}>
              <Button href={adminUrl} style={s.buttonSecondary}>
                Agor panel gweinyddu / Open admin panel
              </Button>
            </Section>

            <Text style={s.footNote}>
              Anfonir y crynodeb hwn yn awtomatig bob dydd Llun.{" "}
              <em>
                This digest is sent automatically every Monday.
              </em>
            </Text>
          </Section>

          {/* ── Footer ─────────────────────────────────────────────────── */}
          <Section style={s.footer}>
            <Text style={s.footerPrimary}>
              Ynni Cymunedol Llanfairfechan &middot; Cwmni Buddiant Cymunedol
            </Text>
            <Text style={s.footerSub}>
              Ynni i&apos;r Gymuned, gan y Gymuned &middot; Energy for the
              Community, by the Community
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default AdminWeeklyDigestEmail;

// ─── Styles ──────────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  body: {
    backgroundColor: cream,
    fontFamily: sans,
    color: navy,
    margin: "0",
    padding: "32px 16px",
  },
  container: {
    maxWidth: "600px",
    margin: "0 auto",
  },

  // Header
  header: {
    backgroundColor: navy,
    padding: "32px 40px",
    borderRadius: "8px 8px 0 0",
  },
  orgName: {
    fontFamily: serif,
    fontSize: "22px",
    fontWeight: "700",
    color: cream,
    margin: "0 0 4px 0",
    lineHeight: "1.2",
  },
  orgSub: {
    fontFamily: sans,
    fontSize: "11px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: creamMuted,
    margin: "0 0 20px 0",
  },
  goldLine: {
    height: "3px",
    width: "48px",
    backgroundColor: gold,
    borderRadius: "2px",
    marginBottom: "20px",
  },
  headerLabel: {
    fontFamily: sans,
    fontSize: "13px",
    color: creamMuted,
    margin: "0 0 6px 0",
    letterSpacing: "0.05em",
  },
  headerDates: {
    fontFamily: serif,
    fontSize: "18px",
    fontWeight: "700",
    color: cream,
    margin: "0",
  },

  // Content
  content: {
    backgroundColor: cream,
    padding: "40px",
  },

  // Section headings
  sectionHeadingCy: {
    fontFamily: serif,
    fontSize: "20px",
    fontWeight: "700",
    color: navy,
    margin: "0 0 4px 0",
    lineHeight: "1.3",
  },
  sectionHeadingEn: {
    fontFamily: serif,
    fontSize: "14px",
    fontStyle: "italic",
    color: navyMuted,
    margin: "0 0 20px 0",
  },

  // Stat row
  statRow: {
    margin: "0 0 16px 0",
  },
  statCell: {
    textAlign: "center",
    padding: "12px 8px",
    backgroundColor: `${navy}0D`,
    borderRadius: "6px",
    margin: "0 4px",
  },
  statNumber: {
    fontFamily: serif,
    fontSize: "32px",
    fontWeight: "700",
    color: navy,
    margin: "0 0 4px 0",
    lineHeight: "1",
    textAlign: "center",
  },
  statLabelCy: {
    fontSize: "12px",
    fontWeight: "600",
    color: navy,
    margin: "0 0 2px 0",
    textAlign: "center",
  },
  statLabelEn: {
    fontSize: "11px",
    fontStyle: "italic",
    color: navyMuted,
    margin: "0",
    textAlign: "center",
  },

  // Total badge
  totalBadge: {
    textAlign: "center",
    margin: "0 0 4px 0",
  },
  totalBadgeText: {
    fontSize: "13px",
    color: navyMuted,
    margin: "0",
    textAlign: "center",
  },

  // Count badge
  countBadge: {
    backgroundColor: `${green}18`,
    border: `1px solid ${green}50`,
    borderRadius: "6px",
    padding: "10px 16px",
    margin: "0 0 16px 0",
    textAlign: "center",
  },
  countBadgeText: {
    fontSize: "14px",
    fontWeight: "600",
    color: green,
    margin: "0",
    textAlign: "center",
  },

  // Member rows
  memberRow: {
    borderLeft: `3px solid ${navySubtle}`,
    paddingLeft: "12px",
    margin: "0 0 12px 0",
  },
  memberName: {
    fontSize: "15px",
    fontWeight: "600",
    color: navy,
    margin: "0 0 2px 0",
  },
  memberEmail: {
    fontSize: "13px",
    color: navyMuted,
    margin: "0",
  },

  moreNote: {
    fontSize: "12px",
    color: navySubtle,
    fontStyle: "italic",
    margin: "0 0 16px 0",
  },

  // Empty state
  emptyBox: {
    backgroundColor: `${navy}08`,
    border: `1px solid ${navySubtle}30`,
    borderRadius: "6px",
    padding: "16px 20px",
    margin: "0 0 4px 0",
  },
  emptyText: {
    fontSize: "14px",
    color: navyMuted,
    margin: "0 0 4px 0",
    textAlign: "center",
  },
  emptyTextEn: {
    fontSize: "12px",
    fontStyle: "italic",
    color: navySubtle,
    margin: "0",
    textAlign: "center",
  },

  divider: {
    borderTop: `1px solid ${navySubtle}40`,
    margin: "28px 0",
  },

  // Buttons
  buttonWrap: {
    textAlign: "center",
    margin: "0 0 24px 0",
  },
  button: {
    backgroundColor: navy,
    color: cream,
    fontFamily: sans,
    fontSize: "15px",
    fontWeight: "600",
    textDecoration: "none",
    padding: "12px 28px",
    borderRadius: "4px",
    display: "inline-block",
    lineHeight: "1",
  },
  buttonSecondary: {
    backgroundColor: "transparent",
    color: navy,
    fontFamily: sans,
    fontSize: "14px",
    fontWeight: "600",
    textDecoration: "none",
    padding: "10px 24px",
    borderRadius: "4px",
    border: `2px solid ${navy}`,
    display: "inline-block",
    lineHeight: "1",
  },

  footNote: {
    fontSize: "12px",
    color: navySubtle,
    lineHeight: "1.6",
    margin: "0",
    textAlign: "center",
  },

  // Footer
  footer: {
    backgroundColor: navy,
    padding: "24px 40px",
    borderRadius: "8px",
    marginTop: "8px",
    textAlign: "center",
  },
  footerPrimary: {
    fontSize: "12px",
    color: creamMuted,
    margin: "0 0 4px 0",
    textAlign: "center",
  },
  footerSub: {
    fontSize: "11px",
    color: creamSubtle,
    margin: "0",
    textAlign: "center",
  },
};
