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
export interface RenewalReminderEmailProps {
  /** Member's full name. */
  name: string;
  /** Human-readable expiry date, e.g. "14 April 2027". */
  expiryDate: string;
  /** Days remaining until expiry (used to tailor the urgency of the message). */
  daysRemaining: number;
  /** URL to the member dashboard. */
  dashboardUrl: string;
}

// ─── Component ───────────────────────────────────────────────────────────────
export function RenewalReminderEmail({
  name,
  expiryDate,
  daysRemaining,
  dashboardUrl,
}: RenewalReminderEmailProps) {
  const isFinal = daysRemaining <= 7;

  const previewText = isFinal
    ? `Mae eich aelodaeth yn dod i ben mewn ${daysRemaining} diwrnod — Your membership expires in ${daysRemaining} days`
    : `Mae eich aelodaeth yn dod i ben mewn 30 diwrnod — Your membership expires in 30 days`;

  const headingCy = isFinal ? "Nodyn Terfynol" : "Atgoffa am Adnewyddu";
  const headingEn = isFinal ? "Final Reminder" : "Renewal Reminder";

  const urgencyCy = isFinal
    ? `Mae eich aelodaeth yn dod i ben mewn ${daysRemaining} diwrnod.`
    : "Mae eich aelodaeth yn dod i ben ymhen 30 diwrnod.";
  const urgencyEn = isFinal
    ? `Your membership expires in ${daysRemaining} days.`
    : "Your membership expires in 30 days.";

  return (
    <Html lang="cy">
      <Head />
      <Preview>{previewText}</Preview>

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
            {/* Warning banner */}
            <Section style={isFinal ? s.bannerFinal : s.bannerWarning}>
              <Text style={s.bannerText}>
                {isFinal ? "⚠ " : ""}
                {urgencyCy}
              </Text>
              <Text style={s.bannerTextEn}>{urgencyEn}</Text>
            </Section>

            <Heading as="h1" style={s.h1Cy}>
              {headingCy}, {name}
            </Heading>
            <Text style={s.h1En}>
              {headingEn}, {name}
            </Text>

            <Text style={s.bodyCy}>
              Mae eich aelodaeth yn Ynni Cymunedol Llanfairfechan yn dod i ben
              ar <strong>{expiryDate}</strong>. Mae angen dilysu aelodaeth bob
              12 mis i gadarnhau eich bod chi&apos;n dal i fod yn breswylydd yn
              ardal Llanfairfechan.
            </Text>
            <Text style={s.bodyEn}>
              Your membership with Ynni Cymunedol Llanfairfechan expires on{" "}
              <strong>{expiryDate}</strong>. Membership must be re-verified every
              12 months to confirm that you are still a resident of the
              Llanfairfechan area.
            </Text>

            <Text style={s.bodyCy}>
              Nid oes angen i chi wneud unrhyw beth ar hyn o bryd — bydd ein
              tîm aelodaeth yn cysylltu â chi i gwblhau&apos;r broses
              dilysu ar ôl i&apos;ch aelodaeth ddod i ben. Fodd bynnag,
              sicrhewch fod eich manylion (enw a chod post) yn gywir yn eich
              cyfrif.
            </Text>
            <Text style={s.bodyEn}>
              You do not need to take any action right now — our membership team
              will be in touch to complete the re-verification process after your
              membership expires. However, please ensure your details (name and
              postcode) are up to date in your account.
            </Text>

            {/* CTA */}
            <Section style={s.buttonWrap}>
              <Button href={dashboardUrl} style={s.button}>
                Gwiriwch eich manylion / Check your details
              </Button>
            </Section>

            <Hr style={s.divider} />

            <Text style={s.securityNote}>
              Os credwch fod y neges hon wedi ei hanfon atoch ar gam, gallwch
              ei hanwybyddu.{" "}
              <em>
                If you believe this message was sent to you in error, you can
                safely ignore it.
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

export default RenewalReminderEmail;

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

  // Banners
  bannerWarning: {
    backgroundColor: `${gold}18`,
    border: `1px solid ${gold}50`,
    borderRadius: "6px",
    padding: "14px 18px",
    margin: "0 0 28px 0",
  },
  bannerFinal: {
    backgroundColor: "#c0392b18",
    border: "1px solid #c0392b50",
    borderRadius: "6px",
    padding: "14px 18px",
    margin: "0 0 28px 0",
  },
  bannerText: {
    fontSize: "15px",
    fontWeight: "600",
    color: navy,
    margin: "0 0 4px 0",
    lineHeight: "1.4",
  },
  bannerTextEn: {
    fontSize: "13px",
    fontStyle: "italic",
    color: navyMuted,
    margin: "0",
    lineHeight: "1.4",
  },

  // Headings
  h1Cy: {
    fontFamily: serif,
    fontSize: "28px",
    fontWeight: "700",
    color: navy,
    margin: "0 0 6px 0",
    lineHeight: "1.3",
  },
  h1En: {
    fontFamily: serif,
    fontSize: "17px",
    fontStyle: "italic",
    color: navyMuted,
    margin: "0 0 28px 0",
  },

  // Body text
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
