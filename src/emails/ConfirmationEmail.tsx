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
export interface ConfirmationEmailProps {
  /** The confirmation URL. */
  confirmationUrl: string;
  /** The new member's name. */
  name?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────
export function ConfirmationEmail({
  confirmationUrl,
  name,
}: ConfirmationEmailProps) {
  return (
    <Html lang="cy">
      <Head />
      <Preview>
        Croeso i Ynni Cymunedol Llanfairfechan — cadarnhewch eich cyfeiriad
        e-bost / Confirm your email address
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
              {name ? `Croeso, ${name}!` : "Croeso!"}
            </Heading>
            <Text style={s.h1En}>{name ? `Welcome, ${name}!` : "Welcome!"}</Text>

            <Text style={s.bodyCy}>
              Diolch am ymuno ag Ynni Cymunedol Llanfairfechan. Cadarnhewch
              eich cyfeiriad e-bost i gwblhau'r broses gofrestru.
            </Text>
            <Text style={s.bodyEn}>
              Thank you for joining Ynni Cymunedol Llanfairfechan. Please
              confirm your email address to complete your registration.
            </Text>

            {/* CTA button */}
            <Section style={s.buttonWrap}>
              <Button href={confirmationUrl} style={s.button}>
                Cadarnhau cyfeiriad e-bost / Confirm email
              </Button>
            </Section>

            <Text style={s.expiry}>
              Mae&apos;r ddolen hon yn ddilys am 24 awr.{" "}
              <em>This link is valid for 24 hours.</em>
            </Text>

            <Hr style={s.divider} />

            <Text style={s.securityNote}>
              Os nad oeddech chi&apos;n disgwyl yr e-bost hwn, gallwch ei
              anwybyddu&apos;n ddiogel — ni fydd unrhyw gyfrif yn cael ei greu.{" "}
              <em>
                If you didn&apos;t expect this email, you can safely ignore it
                — no account will be created.
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

export default ConfirmationEmail;

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
  content: {
    backgroundColor: cream,
    padding: "40px",
  },
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
    margin: "0 0 32px 0",
  },
  buttonWrap: {
    textAlign: "center",
    margin: "0 0 28px 0",
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
  expiry: {
    fontSize: "13px",
    color: navySubtle,
    lineHeight: "1.5",
    margin: "0 0 28px 0",
    textAlign: "center",
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
