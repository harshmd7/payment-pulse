import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  outstanding_amount: number;
  days_overdue: number;
  risk_score: number;
  payment_history: any[];
  behavioral_data: Record<string, any>;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AnalysisResult {
  id: string;
  user_id: string;
  customer_id: string | null;
  analysis_type: string;
  ai_insights: Record<string, any>;
  risk_assessment: Record<string, any>;
  recommended_actions: any[];
  confidence_score: number;
  created_at: string;
}

export interface UploadedFile {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string | null;
  file_type: string | null;
  processing_status: string;
  records_processed: number;
  created_at: string;
}
