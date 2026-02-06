/*
  # Payment Pulse Database Schema

  ## Overview
  This migration creates the complete database schema for the Payment Pulse application,
  an AI-powered debt collection and customer behavior analysis platform.

  ## New Tables
  
  ### `profiles`
  - `id` (uuid, primary key) - References auth.users
  - `email` (text) - User email
  - `full_name` (text) - User's full name
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `customers`
  - `id` (uuid, primary key) - Unique customer identifier
  - `user_id` (uuid) - References profiles(id) - Owner of this customer record
  - `name` (text) - Customer name
  - `email` (text) - Customer email
  - `phone` (text) - Customer phone number
  - `outstanding_amount` (numeric) - Amount owed
  - `days_overdue` (integer) - Number of days payment is overdue
  - `risk_score` (numeric) - AI-calculated risk score (0-100)
  - `payment_history` (jsonb) - Historical payment data
  - `behavioral_data` (jsonb) - Customer behavior patterns
  - `status` (text) - Customer status (active, resolved, high_risk, etc.)
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `analysis_results`
  - `id` (uuid, primary key) - Unique analysis identifier
  - `user_id` (uuid) - References profiles(id) - User who requested analysis
  - `customer_id` (uuid) - References customers(id) - Customer being analyzed
  - `analysis_type` (text) - Type of analysis (risk_assessment, behavior_prediction, etc.)
  - `ai_insights` (jsonb) - AI-generated insights and recommendations
  - `risk_assessment` (jsonb) - Detailed risk breakdown
  - `recommended_actions` (jsonb) - AI-recommended collection strategies
  - `confidence_score` (numeric) - AI confidence level (0-100)
  - `created_at` (timestamptz) - Analysis timestamp

  ### `uploaded_files`
  - `id` (uuid, primary key) - Unique file identifier
  - `user_id` (uuid) - References profiles(id) - User who uploaded the file
  - `file_name` (text) - Original file name
  - `file_path` (text) - Storage path
  - `file_type` (text) - File MIME type
  - `processing_status` (text) - Status (pending, processing, completed, failed)
  - `records_processed` (integer) - Number of customer records processed
  - `created_at` (timestamptz) - Upload timestamp

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Policies enforce user_id matching for all operations
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  phone text,
  outstanding_amount numeric DEFAULT 0,
  days_overdue integer DEFAULT 0,
  risk_score numeric DEFAULT 0,
  payment_history jsonb DEFAULT '[]'::jsonb,
  behavioral_data jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create analysis_results table
CREATE TABLE IF NOT EXISTS analysis_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  analysis_type text NOT NULL,
  ai_insights jsonb DEFAULT '{}'::jsonb,
  risk_assessment jsonb DEFAULT '{}'::jsonb,
  recommended_actions jsonb DEFAULT '[]'::jsonb,
  confidence_score numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create uploaded_files table
CREATE TABLE IF NOT EXISTS uploaded_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text,
  file_type text,
  processing_status text DEFAULT 'pending',
  records_processed integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_risk_score ON customers(risk_score DESC);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_analysis_user_id ON analysis_results(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_customer_id ON analysis_results(customer_id);
CREATE INDEX IF NOT EXISTS idx_files_user_id ON uploaded_files(user_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_files ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Customers policies
CREATE POLICY "Users can view own customers"
  ON customers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own customers"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own customers"
  ON customers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own customers"
  ON customers FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Analysis results policies
CREATE POLICY "Users can view own analysis results"
  ON analysis_results FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analysis results"
  ON analysis_results FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own analysis results"
  ON analysis_results FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Uploaded files policies
CREATE POLICY "Users can view own uploaded files"
  ON uploaded_files FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own uploaded files"
  ON uploaded_files FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own uploaded files"
  ON uploaded_files FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own uploaded files"
  ON uploaded_files FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();