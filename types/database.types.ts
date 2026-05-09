export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          role_id: string | null
          is_mfa_enabled: boolean
          status: string
          failed_login_attempts: number
          created_at: string
        }
      }
      risk_scores: {
        Row: {
          id: string
          user_id: string
          score: number
          risk_level: string
          factors: Json | null
          evaluated_at: string
        }
      }
    }
  }
}
