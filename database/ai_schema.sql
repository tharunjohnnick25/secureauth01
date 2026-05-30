-- SecureAuth AI Engine Schema
-- This schema extends the base database with AI-specific tracking and intelligence tables.

-- 1. Behavioral Profiles
-- Stores the learned baseline of a user's typing and mouse behavior.
CREATE TABLE IF NOT EXISTS behavioral_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    typing_baseline JSONB DEFAULT '{}', -- stores avg dwell, flight times, and common bigram latencies
    mouse_baseline JSONB DEFAULT '{}',  -- stores avg velocity, acceleration, and click patterns
    login_patterns JSONB DEFAULT '[]',  -- stores typical login hours and frequencies
    trust_score FLOAT DEFAULT 0.5,      -- overall behavioral trust level (0 to 1)
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. AI Risk Scores
-- Stores historical risk assessments for every login attempt or sensitive action.
CREATE TABLE IF NOT EXISTS ai_risk_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID,
    score INTEGER NOT NULL,            -- 0 to 100
    risk_level TEXT NOT NULL,          -- LOW, MEDIUM, HIGH, CRITICAL
    factors JSONB NOT NULL,            -- Array of factor objects: { code, weight, label }
    ip_address TEXT,
    device_id TEXT,
    location JSONB,                    -- { city, country, lat, lng }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Anomaly Logs
-- Stores specific detected security anomalies for admin review.
CREATE TABLE IF NOT EXISTS anomaly_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,                -- IMPOSSIBLE_TRAVEL, GEOLOCATION_ANOMALY, BEHAVIOR_MISMATCH, etc.
    severity TEXT NOT NULL,            -- LOW, MEDIUM, HIGH, CRITICAL
    details JSONB,                     -- Contextual info about the anomaly
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Device Fingerprints
-- Stores detailed hardware/browser signatures to identify devices uniquely.
CREATE TABLE IF NOT EXISTS device_fingerprints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    fingerprint_hash TEXT NOT NULL,
    details JSONB NOT NULL,            -- screen, browser, os, gpu, memory, cores, etc.
    trust_score FLOAT DEFAULT 1.0,     -- how much we trust this specific device
    is_cloned BOOLEAN DEFAULT FALSE,   -- if we detect fingerprint spoofing
    last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, fingerprint_hash)
);

-- 5. AI Model Versions
-- Tracks the local ML models being used for inference.
CREATE TABLE IF NOT EXISTS ai_model_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    version TEXT NOT NULL,
    type TEXT NOT NULL,                -- RANDOM_FOREST, ISOLATION_FOREST, HEURISTIC
    weights_url TEXT,                  -- URL to locally hosted model weights (if applicable)
    metadata JSONB,                    -- model accuracy, training date, etc.
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Behavioral Biometrics History (Rolling Window)
-- Stores recent raw behavior data for local model retraining.
CREATE TABLE IF NOT EXISTS behavior_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,                -- TYPING, MOUSE
    raw_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_risk_scores_user ON ai_risk_scores(user_id);
CREATE INDEX idx_risk_scores_created ON ai_risk_scores(created_at);
CREATE INDEX idx_anomaly_logs_unresolved ON anomaly_logs(is_resolved) WHERE is_resolved = FALSE;
CREATE INDEX idx_behavior_history_user ON behavior_history(user_id);

-- Enable RLS
ALTER TABLE behavioral_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_risk_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE anomaly_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_fingerprints ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own behavioral profile" ON behavioral_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own risk scores" ON ai_risk_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all AI data" ON ai_risk_scores FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('ADMIN', 'SUPER_ADMIN'))
);
