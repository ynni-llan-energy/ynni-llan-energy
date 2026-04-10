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
} from "@react-email/components";
import * as React from "react";

// ─── Brand tokens ────────────────────────────────────────────────────────────
const navy = "#0A4B68";
const cream = "#EEE8D8";
const gold = "#E09800";
const navyMuted = "#437284";
const navySubtle = "#658A95";
const creamMuted = "#AAB9B6";
const creamSubtle = "#7C9AA0";

const serif = "Georgia, 'Times New Roman', Times, serif";
const sans =
  "system-ui, -apple-system, 'Helvetica Neue', Helvetica, Arial, sans-serif";

// ─── Props ───────────────────────────────────────────────────────────────────
export interface EmailChangeEmailProps {
  /** The URL the user must click to confirm the change. */
  confirmationUrl: string;
  /** The old email address. */
  oldEmail: string;
  /** The new email address being confirmed. */
  newEmail: string;
}

// ─── Component ───────────────────────────────────────────────────────────────
export function EmailChangeEmail({
  confirmationUrl,
  oldEmail,
  newEmail,
}: EmailChangeEmailProps) {
  return (
    <Html lang="cy">
      <Head />
      <Preview>
        Cadarnhau eich cyfeiriad e-bost newydd — Confirm your new email address
      </Preview>

      <Body style={s.body}>
        <Container style={s.container}>
          {/* ── Header ─────────────────────────────────────────────────── */}
          <Section style={s.header}>
            <Text style={s.orgName}>Ynni Cymunedol</Text>
            <Text style={s.orgSub}>Llanfairfechan</Text>
            <div style={s.goldLine} />
          </Section>

          {/* ── Content ────────────────────────────────────────────────── */}
          <Section style={s.content}>
            <Heading as="h1" style={s.h1Cy}>
              Newid Cyfeiriad E-bost
            </Heading>
            <Text style={s.h1En}>Email Address Change</Text>

            <Text style={s.bodyCy}>
              Rydych wedi gofyn i newid eich cyfeiriad e-bost ar gyfer eich
              cyfrif Ynni Cymunedol.
            </Text>
            <Text style={s.bodyEn}>
              You&apos;ve requested a change to the email address on your Ynni
              Cymunedol account.
            </Text>

            {/* Address change summary */}
            <Section style={s.summaryBox}>
              <table
                width="100%"
                cellPadding="0"
                cellSpacing="0"
                style={{ borderCollapse: "collapse" }}
              >
                <tbody>
                  <tr>
                    <td style={s.summaryLabel}>
                      Hen gyfeiriad / Old address
                    </td>
                    <td style={s.summaryValue}>{oldEmail}</td>
                  </tr>
                  <tr>
                    <td style={{ ...s.summaryLabel, paddingTop: "8px" }}>
                      Cyfeiriad newydd / New address
                    </td>
                    <td style={{ ...s.summaryValue, paddingTop: "8px", color: gold }}>
                      {newEmail}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            <Text style={s.instructCy}>
              Cliciwch y botwm isod i gadarnhau&apos;r newid.
            </Text>
            <Text style={s.instructEn}>
              Click the button below to confirm the change.
            </Text>

            {/* CTA button */}
            <Section style={s.buttonWrap}>
              <Button href={confirmationUrl} style={s.button}>
                Cadarnhau / Confirm
              </Button>
            </Section>

            <Hr style={s.divider} />

            <Text style={s.securityNote}>
              Os na wnaethoch chi ofyn am y newid hwn, anwybyddwch yr e-bost hwn
              — ni fydd eich cyfeiriad yn newid.{" "}
              <em>
                If you didn&apos;t request this change, you can safely ignore
                this email — your address will not change.
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

export default EmailChangeEmail;

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
  },

  // Content
  content: {
    backgroundColor: cream,
    padding: "40px",
  },
  h1Cy: {
    fontFamily: serif,
    fontSize: "26px",
    fontWeight: "700",
    color: navy,
    margin: "0 0 6px 0",
    lineHeight: "1.3",
  },
  h1En: {
    fontFamily: serif,
    fontSize: "16px",
    fontStyle: "italic",
    color: navyMuted,
    margin: "0 0 28px 0",
  },
  bodyCy: {
    fontSize: "16px",
    color: navy,
    lineHeight: "1.65",
    margin: "0 0 6px 0",
  },
  bodyEn: {
    fontSize: "14px",
    fontStyle: "italic",
    color: navyMuted,
    lineHeight: "1.65",
    margin: "0 0 28px 0",
  },

  // Address summary box
  summaryBox: {
    backgroundColor: "#FFFFFF",
    border: `1px solid ${navySubtle}`,
    borderLeft: `4px solid ${gold}`,
    borderRadius: "4px",
    padding: "16px 20px",
    margin: "0 0 28px 0",
  },
  summaryLabel: {
    fontSize: "11px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: navySubtle,
    paddingRight: "16px",
    whiteSpace: "nowrap",
  },
  summaryValue: {
    fontSize: "14px",
    color: navy,
    fontWeight: "500",
  },

  instructCy: {
    fontSize: "16px",
    color: navy,
    lineHeight: "1.65",
    margin: "0 0 6px 0",
  },
  instructEn: {
    fontSize: "14px",
    fontStyle: "italic",
    color: navyMuted,
    lineHeight: "1.65",
    margin: "0 0 32px 0",
  },

  // Button
  buttonWrap: {
    textAlign: "center",
    margin: "0 0 36px 0",
  },
  button: {
    backgroundColor: navy,
    color: cream,
    fontFamily: sans,
    fontSize: "16px",
    fontWeight: "600",
    textDecoration: "none",
    padding: "14px 32px",
    borderRadius: "4px",
    display: "inline-block",
    lineHeight: "1",
  },

  divider: {
    borderTop: `1px solid ${navySubtle}`,
    margin: "0 0 24px 0",
  },
  securityNote: {
    fontSize: "12px",
    color: navySubtle,
    lineHeight: "1.6",
    margin: "0",
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
