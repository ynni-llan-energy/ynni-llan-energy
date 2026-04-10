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
// Pre-multiplied muted variants (opacity baked in against their backgrounds)
const navyMuted = "#437284"; // navy 75 % on cream
const navySubtle = "#658A95"; // navy 60 % on cream
const creamMuted = "#AAB9B6"; // cream 70 % on navy
const creamSubtle = "#7C9AA0"; // cream 50 % on navy

const serif = "Georgia, 'Times New Roman', Times, serif";
const sans =
  "system-ui, -apple-system, 'Helvetica Neue', Helvetica, Arial, sans-serif";
const mono = "'Courier New', Courier, monospace";

// ─── Props ───────────────────────────────────────────────────────────────────
export interface MagicLinkEmailProps {
  /** The full magic-link / OTP URL to embed in the button. */
  magicLinkUrl: string;
  /** The 6-character one-time code (shown as a fallback). */
  otp: string;
  /** Recipient's email address (used for accessibility). */
  email: string;
  /** Determines the copy shown — "signup" for new members, "login" for existing. */
  type?: "signup" | "login";
}

// ─── Component ───────────────────────────────────────────────────────────────
export function MagicLinkEmail({
  magicLinkUrl,
  otp,
  email: _email,
  type = "login",
}: MagicLinkEmailProps) {
  const isSignup = type === "signup";

  const previewText = isSignup
    ? "Croeso i Ynni Cymunedol Llanfairfechan — Welcome to Ynni Cymunedol Llanfairfechan"
    : "Eich dolen fewngofnodi — Your sign-in link";

  const headingCy = isSignup ? "Croeso" : "Croeso yn ôl";
  const headingEn = isSignup ? "Welcome" : "Welcome back";

  const bodyCy = isSignup
    ? "Diolch am ymuno! Cliciwch y botwm isod i gadarnhau eich cyfeiriad e-bost a chwblhau'r broses gofrestru."
    : "Cliciwch y botwm isod i fewngofnodi i'ch cyfrif Ynni Cymunedol.";

  const bodyEn = isSignup
    ? "Thank you for joining! Click the button below to confirm your email address and complete registration."
    : "Click the button below to sign in to your Ynni Cymunedol account.";

  const ctaLabelCy = isSignup ? "Cadarnhau cyfeiriad e-bost" : "Mewngofnodwch";
  const ctaLabelEn = isSignup ? "Confirm email address" : "Sign in";

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
            <Heading as="h1" style={s.h1Cy}>
              {headingCy}
            </Heading>
            <Text style={s.h1En}>{headingEn}</Text>

            <Text style={s.bodyCy}>{bodyCy}</Text>
            <Text style={s.bodyEn}>{bodyEn}</Text>

            {/* CTA button */}
            <Section style={s.buttonWrap}>
              <Button href={magicLinkUrl} style={s.button}>
                {ctaLabelCy} / {ctaLabelEn}
              </Button>
            </Section>

            {/* OTP code */}
            <Text style={s.codeLabel}>
              Neu defnyddiwch y cod hwn / Or use this code:
            </Text>
            <Section style={s.codeBox}>
              <Text style={s.code}>{otp}</Text>
            </Section>

            <Text style={s.expiry}>
              Mae&apos;r ddolen hon yn ddilys am awr.{" "}
              <em>This link is valid for one hour.</em>
            </Text>

            <Hr style={s.divider} />

            <Text style={s.securityNote}>
              Os nad oeddech chi&apos;n disgwyl yr e-bost hwn, gallwch ei
              anwybyddu&apos;n ddiogel.{" "}
              <em>
                If you didn&apos;t expect this email, you can safely ignore it.
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

export default MagicLinkEmail;

// ─── Styles ──────────────────────────────────────────────────────────────────
// All styles are plain CSSProperties so they inline correctly across clients.

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

  // OTP code
  codeLabel: {
    fontSize: "13px",
    color: navyMuted,
    margin: "0 0 10px 0",
    textAlign: "center",
  },
  codeBox: {
    backgroundColor: navy,
    borderRadius: "8px",
    padding: "18px 24px",
    textAlign: "center",
    margin: "0 auto 28px",
    maxWidth: "240px",
  },
  code: {
    fontFamily: mono,
    fontSize: "34px",
    fontWeight: "700",
    color: cream,
    letterSpacing: "0.35em",
    margin: "0",
    textAlign: "center",
  },

  expiry: {
    fontSize: "13px",
    color: navySubtle,
    lineHeight: "1.5",
    margin: "0 0 24px 0",
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
