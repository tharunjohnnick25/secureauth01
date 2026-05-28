export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: string;
          org_id: string | null;
          created_at: string;
          mfa_settings: Json | null;
          risk_score: number;
        };
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          domain: string;
          created_at: string;
          subscription_id: string | null;
        };
      };
      employee_requests: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          status: 'pending' | 'approved' | 'rejected';
          reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email: string;
          status?: 'pending' | 'approved' | 'rejected';
          reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string;
          status?: 'pending' | 'approved' | 'rejected';
          reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          org_id: string;
          plan_id: string;
          status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
          current_period_end: string;
          razorpay_subscription_id: string | null;
        };
      };
      payments: {
        Row: {
          id: string;
          org_id: string;
          amount: number;
          currency: string;
          status: 'SUCCESS' | 'FAILED' | 'PENDING';
          razorpay_payment_id: string | null;
          created_at: string;
        };
      };
      login_logs: {
        Row: {
          id: string;
          user_id: string;
          ip_address: string;
          user_agent: string;
          location: Json | null;
          status: 'SUCCESS' | 'FAILURE';
          risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
          created_at: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          resource: string;
          old_value: Json | null;
          new_value: Json | null;
          created_at: string;
        };
      };
      sessions: {
        Row: {
          id: string;
          user_id: string;
          token: string;
          device_id: string;
          expires_at: string;
          last_active: string;
        };
      };
      devices: {
        Row: {
          id: string;
          user_id: string;
          device_name: string;
          device_type: string;
          os: string;
          browser: string;
          is_trusted: boolean;
          last_used: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: 'INFO' | 'WARNING' | 'CRITICAL';
          is_read: boolean;
          created_at: string;
        };
      };
      support_queries: {
        Row: {
          id: string;
          user_id: string;
          subject: string;
          message: string;
          status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
          created_at: string;
        };
      };
      threat_logs: {
        Row: {
          id: string;
          type: string;
          severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
          description: string;
          source_ip: string | null;
          created_at: string;
        };
      };
      access_requests: {
        Row: {
          id: string;
          user_id: string;
          resource: string;
          status: 'PENDING' | 'APPROVED' | 'REJECTED';
          reason: string | null;
          created_at: string;
        };
      };
      security_events: {
        Row: {
          id: string;
          event_type: string;
          details: Json | null;
          severity: string;
          created_at: string;
        };
      };
      office_access_logs: {
        Row: {
          id: string;
          user_id: string;
          location: string;
          access_type: 'ENTRY' | 'EXIT';
          timestamp: string;
        };
      };
      active_sessions: {
        Row: {
          id: string;
          user_id: string;
          device_id: string;
          ip_address: string;
          last_active: string;
        };
      };
      behavioral_biometrics: {
        Row: {
          id: string;
          user_id: string;
          typing_speed: number;
          error_rate: number;
          cadence_hash: string;
          created_at: string;
        };
      };
      ai_risk_scores: {
        Row: {
          id: string;
          user_id: string;
          score: number;
          factors: Json | null;
          calculated_at: string;
        };
      };
    };
  };
}
