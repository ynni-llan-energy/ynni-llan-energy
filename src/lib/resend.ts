import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Default from address.
 * The domain must be verified in your Resend account.
 * Update RESEND_FROM_ADDRESS in your environment to override.
 */
export const FROM_ADDRESS =
  process.env.RESEND_FROM_ADDRESS ??
  "Ynni Cymunedol Llanfairfechan <aelodaeth@ynni-llan.cymru>";
