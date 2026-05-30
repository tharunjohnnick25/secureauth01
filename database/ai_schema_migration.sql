-- SecureAuth: Custom ML & Behavioral AI Engine Database Schema Migration
-- Run this script in your Supabase SQL Editor to establish all custom telemetry, behavioral baseline, and prediction tables.

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Behavioral Profiles Table
-- Stores the compiled statistical baselines of user typing and behavioral habits.
CREATE TABLE IF NOT EXISTS public.behavioral_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    typing_baseline JSONB DEFAULT '{}'::jsonb, -- average dwell, flight times, bigram latencies
    mouse_baseline JSONB DEFAULT '{}'::jsonb,  -- mouse velocity, acceleration vector distributions
    login_patterns JSONB DEFAULT '[]'::jsonb,  -- typical hours of day (0-23) and days of week (0-6)
    attendance_baseline JSONB DEFAULT '{}'::jsonb, -- typical check-in times and shift ranges
    trust_score NUMERIC(5,2) DEFAULT 100.00,  -- calculated overall user trust percentage (0-100)
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Device Trust Table
-- Registers unique hardware fingerprints, canvas values, and custom trust scores per user.
CREATE TABLE IF NOT EXISTS public.device_trust (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    fingerprint_hash VARCHAR(255) NOT NULL,
    details JSONB NOT NULL, -- screen resolution, gpu rendering context, timezone, OS context
    trust_score NUMERIC(5,2) DEFAULT 100.00, -- calculated trust score (0-100)
    is_cloned BOOLEAN DEFAULT FALSE, -- high threat flag if fingerprint spoofing is detected
    last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, fingerprint_hash)
);

-- 3. AI Risk Scores Table
-- Stores granular risk evaluations, severity categorization, and trigger factors for auditing.
CREATE TABLE IF NOT EXISTS public.ai_risk_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    session_id UUID,
    score INT NOT NULL, -- normalized risk score (0-100)
    risk_level VARCHAR(20) NOT NULL, -- LOW, MEDIUM, HIGH, CRITICAL
    factors JSONB NOT NULL DEFAULT '[]'::jsonb, -- array of { code, weight, label }
    ip_address INET,
    device_id VARCHAR(255),
    location JSONB, -- country, city, coordinates
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Anomaly Logs Table
-- Logs specific detected anomalies like impossible travel, typing shifts, and volumetric spikes.
CREATE TABLE IF NOT EXISTS public.anomaly_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- IMPOSSIBLE_TRAVEL, TYPING_SHIFT, DEVICE_MISMATCH, HOUR_OUTLIER
    severity VARCHAR(20) NOT NULL, -- LOW, MEDIUM, HIGH, CRITICAL
    details JSONB DEFAULT '{}'::jsonb, -- variables triggering anomaly
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Threat Predictions Table
-- Stores machine learning output predicting account compromises and recommendations.
CREATE TABLE IF NOT EXISTS public.threat_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    compromise_probability NUMERIC(5,2) NOT NULL, -- predicted percentage (0.00 - 100.00%)
    factors JSONB NOT NULL DEFAULT '[]'::jsonb, -- array of contributing vulnerabilities
    recommendations JSONB NOT NULL DEFAULT '[]'::jsonb, -- array of suggested security interventions
    predicted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. ML Predictions Table
-- Historical ledger of inference operations for model tracking and feedback calibration.
CREATE TABLE IF NOT EXISTS public.ml_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    model_name VARCHAR(100) NOT NULL, -- CosineBiometrics, HaversineTravel, BayesianPredictor
    inputs JSONB NOT NULL, -- features fed to the model
    outputs JSONB NOT NULL, -- score, class, or confidence output
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Risk History Table
-- Records daily aggregates for historical threat trends and reporting metrics.
CREATE TABLE IF NOT EXISTS public.risk_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    score INT NOT NULL, -- risk score aggregate
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ==================================================
CREATE INDEX IF NOT EXISTS idx_behavioral_profiles_uid ON public.behavioral_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_device_trust_uid_hash ON public.device_trust(user_id, fingerprint_hash);
CREATE INDEX IF NOT EXISTS idx_ai_risk_scores_uid_time ON public.ai_risk_scores(user_id, calculated_at DESC);
CREATE INDEX IF NOT EXISTS idx_anomaly_logs_unresolved ON public.anomaly_logs(is_resolved) WHERE is_resolved = FALSE;
CREATE INDEX IF NOT EXISTS idx_threat_predictions_uid ON public.threat_predictions(user_id, predicted_at DESC);
CREATE INDEX IF NOT EXISTS idx_ml_predictions_model ON public.ml_predictions(model_name);
CREATE INDEX IF NOT EXISTS idx_risk_history_uid_time ON public.risk_history(user_id, calculated_at DESC);

-- ==================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==================================================
ALTER TABLE public.behavioral_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_trust ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_risk_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anomaly_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threat_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ml_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_history ENABLE ROW LEVEL SECURITY;

-- 1. Users can read their own profiles, devices, risk score history, and predictions.
CREATE POLICY "Users can read own behavioral profile" ON public.behavioral_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can read own device trust" ON public.device_trust FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can read own risk scores" ON public.ai_risk_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can read own anomalies" ON public.anomaly_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can read own predictions" ON public.threat_predictions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can read own risk history" ON public.risk_history FOR SELECT USING (auth.uid() = user_id);

-- 2. Security Analysts and Admins can view all telemetry for identity governance.
CREATE POLICY "Admins can view all behavioral profiles" ON public.behavioral_profiles FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role IN ('ADMIN', 'SUPER_ADMIN', 'SECURITY_ANALYST', 'ORGANIZATION_ADMIN'))
);
CREATE POLICY "Admins can view all device trust" ON public.device_trust FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role IN ('ADMIN', 'SUPER_ADMIN', 'SECURITY_ANALYST', 'ORGANIZATION_ADMIN'))
);
CREATE POLICY "Admins can view all risk scores" ON public.ai_risk_scores FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role IN ('ADMIN', 'SUPER_ADMIN', 'SECURITY_ANALYST', 'ORGANIZATION_ADMIN'))
);
CREATE POLICY "Admins can view all anomalies" ON public.anomaly_logs FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role IN ('ADMIN', 'SUPER_ADMIN', 'SECURITY_ANALYST', 'ORGANIZATION_ADMIN'))
);
CREATE POLICY "Admins can view all predictions" ON public.threat_predictions FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role IN ('ADMIN', 'SUPER_ADMIN', 'SECURITY_ANALYST', 'ORGANIZATION_ADMIN'))
);
CREATE POLICY "Admins can view all ML predictions" ON public.ml_predictions FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role IN ('ADMIN', 'SUPER_ADMIN', 'SECURITY_ANALYST', 'ORGANIZATION_ADMIN'))
);
CREATE POLICY "Admins can view all risk history" ON public.risk_history FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role IN ('ADMIN', 'SUPER_ADMIN', 'SECURITY_ANALYST', 'ORGANIZATION_ADMIN'))
);
