export type MemberStatus = "pending" | "active" | "suspended";
export type BallotStatus = "draft" | "open" | "closed";

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
          eligible_to_vote: boolean;
          postcode: string | null;
          joined_at: string | null;
          approved_at: string | null;
          approved_by: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["members"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["members"]["Insert"]>;
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
        Insert: Omit<Database["public"]["Tables"]["ballots"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["ballots"]["Insert"]>;
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
        Insert: Omit<Database["public"]["Tables"]["ballot_options"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["ballot_options"]["Insert"]>;
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
        Insert: Omit<Database["public"]["Tables"]["votes"]["Row"], "id" | "created_at">;
        Update: never;
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
        Insert: Omit<Database["public"]["Tables"]["email_sends"]["Row"], "id" | "created_at">;
        Update: never;
      };
    };
  };
}
