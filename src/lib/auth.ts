import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { render } from "@react-email/render";
import { db } from "@/lib/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/lib/db/schema";
import { getResend, FROM_ADDRESS } from "@/lib/resend";
import { MagicLinkEmail } from "@/emails/MagicLinkEmail";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: "database" },
  pages: {
    signIn: "/mewngofnodi",
    verifyRequest: "/mewngofnodi",
    error: "/mewngofnodi",
  },
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: FROM_ADDRESS,
      async sendVerificationRequest({ identifier: email, url }) {
        const html = await render(
          MagicLinkEmail({ magicLinkUrl: url, email })
        );

        await getResend().emails.send({
          from: FROM_ADDRESS,
          to: email,
          subject: "Eich dolen fewngofnodi / Your sign-in link",
          html,
        });
      },
    }),
  ],
});
