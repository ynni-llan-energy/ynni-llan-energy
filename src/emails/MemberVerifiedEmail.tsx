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
const green = "#2B8050";
const navyMuted = "#437284";
const navySubtle = "#658A95";
const creamMuted = "#AAB9B6";
const creamSubtle = "#7C9AA0";

const serif = "Georgia, 'Times New Roman', Times, serif";
const sans =
  "system-ui, -apple-system, 'Helvetica Neue', Helvetica, Arial, sans-serif";

// ─── Props ───────────────────────────────────────────────────────────────────
export interface MemberVerifiedEmailProps {
  /** Member's full name. */
  name: string;
  /** URL to the member dashboard. */
  dashboardUrl: string;
  /** Human-readable expiry date, e.g. "14 April 2027". */
  expiryDate: string;
}

// ─── Component ───────────────────────────────────────────────────────────────
export function MemberVerifiedEmail({
  name,
  dashboardUrl,
  expiryDate,
}: MemberVerifiedEmailProps) {
  return (
    <Html lang="cy">
      <Head />
      <Preview>
        Mae eich aelodaeth wedi ei chadarnhau — Your membership has been
        confirmed
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
            {/* Confirmed badge */}
            <Section style={s.badgeWrap}>
              <Text style={s.badge}>✓ Aelodaeth wedi ei Chadarnhau</Text>
              <Text style={s.badgeEn}>✓ Membership Confirmed</Text>
            </Section>

            <Heading as="h1" style={s.h1Cy}>
              Llongyfarchiadau, {name}!
            </Heading>
            <Text style={s.h1En}>Congratulations, {name}!</Text>

            <Text style={s.bodyCy}>
              Mae eich cais am aelodaeth yn Ynni Cymunedol Llanfairfechan wedi
              ei gymeradwyo. Mae croeso cynnes i chi fel aelod llawn o&apos;n
              cymuned.
            </Text>
            <Text style={s.bodyEn}>
              Your application to join Ynni Cymunedol Llanfairfechan has been
              approved. A warm welcome to you as a full member of our community.
            </Text>

            {/* Expiry notice */}
            <Section style={s.expiryBox}>
              <Text style={s.expiryLabel}>
                Mae eich aelodaeth yn ddilys tan /{" "}
                <em>Your membership is valid until</em>
              </Text>
              <Text style={s.expiryDate}>{expiryDate}</Text>
            </Section>

            <Text style={s.bodyCy}>
              Gallwch fewngofnodi i&apos;ch cyfrif i weld eich manylion a
              chadw&apos;r cyfeiriad post yn gyfredol. Byddwn yn cysylltu â chi
              30 diwrnod cyn i&apos;ch aelodaeth ddod i ben i&apos;ch
              atgoffa am adnewyddu.
            </Text>
            <Text style={s.bodyEn}>
              You can sign in to your account to view your details and keep your
              postcode up to date. We will contact you 30 days before your
              membership expires to remind you about renewal.
            </Text>

            {/* CTA */}
            <Section style={s.buttonWrap}>
              <Button href={dashboardUrl} style={s.button}>
                Ewch i&apos;ch cyfrif / Go to your account
              </Button>
            </Section>

            <Hr style={s.divider} />

            <Text style={s.securityNote}>
              Os credwch fod y neges hon wedi ei hanfon atoch ar gam, cysylltwch
              â ni.{" "}
              <em>
                If you believe this message was sent to you in error, please
                contact us.
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

export default MemberVerifiedEmail;

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

  // Badge
  badgeWrap: {
    marginBottom: "28px",
  },
  badge: {
    display: "inline-block",
    backgroundColor: green,
    color: cream,
    fontFamily: sans,
    fontSize: "13px",
    fontWeight: "600",
    padding: "6px 14px",
    borderRadius: "20px",
    margin: "0 0 4px 0",
  },
  badgeEn: {
    fontSize: "11px",
    fontStyle: "italic",
    color: navyMuted,
    margin: "0",
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

  // Expiry box
  expiryBox: {
    backgroundColor: `${green}15`,
    border: `1px solid ${green}40`,
    borderRadius: "6px",
    padding: "16px 20px",
    margin: "0 0 28px 0",
    textAlign: "center",
  },
  expiryLabel: {
    fontSize: "13px",
    color: navyMuted,
    margin: "0 0 6px 0",
    textAlign: "center",
  },
  expiryDate: {
    fontFamily: serif,
    fontSize: "20px",
    fontWeight: "700",
    color: green,
    margin: "0",
    textAlign: "center",
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
