import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { VolunteerRole } from "@/sanity/queries";

// Register a clean system font stack — no external font fetch needed
Font.registerHyphenationCallback((word) => [word]);

const NAVY = "#0A4B68";
const GOLD = "#C07E00";
const CREAM = "#EEE8D8";
const DARK_CREAM = "#DDD7C5";
const TEXT = "#1a1a1a";
const MUTED = "#555555";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    paddingTop: 48,
    paddingBottom: 60,
    paddingHorizontal: 52,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: TEXT,
    lineHeight: 1.5,
  },
  // ── Header band ──────────────────────────────────────────────
  headerBand: {
    backgroundColor: NAVY,
    marginHorizontal: -52,
    marginTop: -48,
    paddingHorizontal: 52,
    paddingTop: 32,
    paddingBottom: 28,
    marginBottom: 32,
  },
  orgName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
    color: CREAM,
    letterSpacing: 0.5,
  },
  orgSub: {
    fontSize: 8,
    color: CREAM,
    opacity: 0.7,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 7,
    color: GOLD,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: 20,
    fontFamily: "Helvetica-Bold",
  },
  // ── Role header ───────────────────────────────────────────────
  roleTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 22,
    color: NAVY,
    lineHeight: 1.2,
    marginBottom: 4,
  },
  roleTitleEn: {
    fontSize: 13,
    color: MUTED,
    fontStyle: "italic",
    marginBottom: 16,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: GOLD,
    borderLeftStyle: "solid",
  },
  summary: {
    fontSize: 11,
    color: TEXT,
    lineHeight: 1.6,
    marginBottom: 24,
  },
  // ── Info chips ────────────────────────────────────────────────
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 20,
  },
  chip: {
    backgroundColor: CREAM,
    borderRadius: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 8,
    color: NAVY,
  },
  chipGold: {
    backgroundColor: DARK_CREAM,
    borderRadius: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 8,
    color: GOLD,
    fontFamily: "Helvetica-Bold",
  },
  // ── Section ───────────────────────────────────────────────────
  sectionHeader: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: NAVY,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    borderBottomWidth: 1,
    borderBottomColor: DARK_CREAM,
    borderBottomStyle: "solid",
    paddingBottom: 4,
    marginBottom: 8,
    marginTop: 20,
  },
  bodyText: {
    fontSize: 10,
    color: TEXT,
    lineHeight: 1.65,
    marginBottom: 6,
  },
  bodyTextEn: {
    fontSize: 9,
    color: MUTED,
    lineHeight: 1.6,
    fontStyle: "italic",
    marginBottom: 4,
  },
  // ── Time commitment box ───────────────────────────────────────
  infoBox: {
    backgroundColor: CREAM,
    borderLeftWidth: 3,
    borderLeftColor: GOLD,
    borderLeftStyle: "solid",
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
  },
  infoBoxLabel: {
    fontSize: 7,
    color: GOLD,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    fontFamily: "Helvetica-Bold",
    marginBottom: 3,
  },
  infoBoxText: {
    fontSize: 10,
    color: NAVY,
    fontFamily: "Helvetica-Bold",
  },
  infoBoxTextSub: {
    fontSize: 8,
    color: MUTED,
    fontStyle: "italic",
  },
  // ── Footer ────────────────────────────────────────────────────
  footer: {
    position: "absolute",
    bottom: 28,
    left: 52,
    right: 52,
    borderTopWidth: 1,
    borderTopColor: DARK_CREAM,
    borderTopStyle: "solid",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 7,
    color: MUTED,
  },
  footerBrand: {
    fontSize: 7,
    color: NAVY,
    fontFamily: "Helvetica-Bold",
  },
});

function portableTextToString(blocks: unknown[]): string {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .filter((b): b is { _type: string; children?: { text?: string }[] } =>
      typeof b === "object" && b !== null && (b as { _type?: string })._type === "block"
    )
    .map((b) => b.children?.map((c) => c.text ?? "").join("") ?? "")
    .join("\n\n");
}

interface RoleDocumentProps {
  role: VolunteerRole;
  generatedDate: string;
}

export function RoleDocument({ role, generatedDate }: RoleDocumentProps) {
  const bodyCy = role.body_cy ? portableTextToString(role.body_cy as unknown[]) : "";
  const bodyEn = role.body_en ? portableTextToString(role.body_en as unknown[]) : "";

  return (
    <Document
      title={`${role.title_cy} — Disgrifiad Rôl`}
      author="Ynni Cymunedol Llanfairfechan"
      subject="Disgrifiad Rôl Gwirfoddol / Volunteer Role Description"
      creator="Ynni Cymunedol Llanfairfechan"
    >
      <Page size="A4" style={styles.page}>
        {/* Header band */}
        <View style={styles.headerBand}>
          <Text style={styles.orgName}>Ynni Cymunedol Llanfairfechan</Text>
          <Text style={styles.orgSub}>Community Energy · Disgrifiad Rôl · Role Description</Text>
          <Text style={styles.sectionLabel}>Rôl Wirfoddol / Volunteer Role</Text>
        </View>

        {/* Role title */}
        <Text style={styles.roleTitle}>{role.title_cy}</Text>
        <Text style={styles.roleTitleEn}>{role.title_en}</Text>

        {/* Summary */}
        {role.summary_cy && (
          <Text style={styles.summary}>{role.summary_cy}</Text>
        )}

        {/* Info chips */}
        <View style={styles.chipRow}>
          <Text style={styles.chip}>Ar gael / Available</Text>
          {role.timeCommitment_en && (
            <Text style={styles.chipGold}>{role.timeCommitment_en}</Text>
          )}
          {role.skills?.map((skill) => (
            <Text key={skill} style={styles.chip}>{skill}</Text>
          ))}
        </View>

        {/* Time commitment box */}
        {(role.timeCommitment_cy || role.timeCommitment_en) && (
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxLabel}>Ymrwymiad amser / Time commitment</Text>
            {role.timeCommitment_cy && (
              <Text style={styles.infoBoxText}>{role.timeCommitment_cy}</Text>
            )}
            {role.timeCommitment_en && (
              <Text style={styles.infoBoxTextSub}>{role.timeCommitment_en}</Text>
            )}
          </View>
        )}

        {/* Welsh description */}
        {bodyCy && (
          <>
            <Text style={styles.sectionHeader}>Disgrifiad llawn / Full description</Text>
            {bodyCy.split("\n\n").filter(Boolean).map((para, i) => (
              <Text key={i} style={styles.bodyText}>{para}</Text>
            ))}
          </>
        )}

        {/* English description */}
        {bodyEn && (
          <>
            <Text style={styles.sectionHeader}>English</Text>
            {bodyEn.split("\n\n").filter(Boolean).map((para, i) => (
              <Text key={i} style={styles.bodyTextEn}>{para}</Text>
            ))}
          </>
        )}

        {/* How to apply note */}
        <Text style={[styles.sectionHeader, { marginTop: 24 }]}>
          Sut i fynegi diddordeb / How to express interest
        </Text>
        <Text style={styles.bodyText}>
          Ewch i ynnicymunedolllanfairfechan.cymru/cyfrannu/{role.slug.current} ac
          yna cliciwch &quot;Hoffwn i helpu&quot;. Bydd angen cyfrif aelod arnoch.
        </Text>
        <Text style={styles.bodyTextEn}>
          Visit ynnicymunedolllanfairfechan.cymru/cyfrannu/{role.slug.current} and
          click &quot;I&apos;d like to help&quot;. You will need a member account.
        </Text>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Cynhyrchwyd / Generated: {generatedDate}
          </Text>
          <Text style={styles.footerBrand}>Ynni Cymunedol Llanfairfechan</Text>
        </View>
      </Page>
    </Document>
  );
}
