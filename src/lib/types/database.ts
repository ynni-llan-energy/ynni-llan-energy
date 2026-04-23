export type MemberStatus = "pending" | "active" | "suspended" | "expired";
export type BallotStatus = "draft" | "open" | "closed";
export type RoleStatus = "active" | "filled" | "closed";

export interface Database {
  public: {
    Tables: {
      members: {
        Row: {
          id: string;
          created_at: string;
          email: string;
          full_name: string | null;
          status: MemberStatus;
          is_admin: boolean;
          eligible_to_vote: boolean;
          postcode: string | null;
          joined_at: string | null;
          approved_at: string | null;
          approved_by: string | null;
          membership_expires_at: string | null;
          renewal_notified_at: string | null;
          policy_consent_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          status?: MemberStatus;
          is_admin?: boolean;
          eligible_to_vote?: boolean;
          postcode?: string | null;
          joined_at?: string | null;
          approved_at?: string | null;
          approved_by?: string | null;
          membership_expires_at?: string | null;
          renewal_notified_at?: string | null;
          policy_consent_at?: string | null;
        };
        Update: {
          email?: string;
          full_name?: string | null;
          status?: MemberStatus;
          is_admin?: boolean;
          eligible_to_vote?: boolean;
          postcode?: string | null;
          joined_at?: string | null;
          approved_at?: string | null;
          approved_by?: string | null;
          membership_expires_at?: string | null;
          renewal_notified_at?: string | null;
          policy_consent_at?: string | null;
        };
        Relationships: [];
      };
      ballots: {
        Row: {
          id: string;
          created_at: string;
          title_cy: string;
          title_en: string;
          description_cy: string | null;
          description_en: string | null;
          status: BallotStatus;
          opens_at: string;
          closes_at: string;
          quorum: number | null;
          created_by: string;
        };
        Insert: {
          id?: string;
          title_cy: string;
          title_en: string;
          description_cy?: string | null;
          description_en?: string | null;
          status?: BallotStatus;
          opens_at: string;
          closes_at: string;
          quorum?: number | null;
          created_by: string;
        };
        Update: {
          title_cy?: string;
          title_en?: string;
          description_cy?: string | null;
          description_en?: string | null;
          status?: BallotStatus;
          opens_at?: string;
          closes_at?: string;
          quorum?: number | null;
        };
        Relationships: [];
      };
      ballot_options: {
        Row: {
          id: string;
          created_at: string;
          ballot_id: string;
          label_cy: string;
          label_en: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          ballot_id: string;
          label_cy: string;
          label_en: string;
          sort_order?: number;
        };
        Update: {
          label_cy?: string;
          label_en?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      votes: {
        Row: {
          id: string;
          created_at: string;
          ballot_id: string;
          member_id: string;
          option_id: string;
          voted_at: string;
        };
        Insert: {
          id?: string;
          ballot_id: string;
          member_id: string;
          option_id: string;
          voted_at?: string;
        };
        Update: never;
        Relationships: [];
      };
      email_sends: {
        Row: {
          id: string;
          created_at: string;
          template: string;
          subject: string;
          recipient_count: number;
          triggered_by: string;
          sent_at: string;
        };
        Insert: {
          id?: string;
          template: string;
          subject: string;
          recipient_count?: number;
          triggered_by: string;
          sent_at?: string;
        };
        Update: never;
        Relationships: [];
      };
      role_interest: {
        Row: {
          id: string;
          created_at: string;
          role_slug: string;
          role_title: string;
          member_id: string;
          statement: string | null;
        };
        Insert: {
          id?: string;
          role_slug: string;
          role_title: string;
          member_id: string;
          statement?: string | null;
        };
        Update: {
          statement?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
