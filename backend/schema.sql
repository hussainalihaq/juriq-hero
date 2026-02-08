-- ============================================
-- JURIQ DATABASE SCHEMA
-- Run in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    -- Roles: Student, Founder, Lawyer (Professional)
    role TEXT DEFAULT 'student' CHECK (role IN ('student', 'founder', 'lawyer', 'general')),
    default_jurisdiction TEXT DEFAULT 'pak' CHECK (default_jurisdiction IN ('pak', 'us', 'uk')),
    -- Tiers: Free, Student ($5), Founder ($12), Professional ($29)
    tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'student', 'founder', 'professional')),
    paddle_customer_id TEXT,
    subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'past_due', 'canceled', 'trialing')),
    subscription_end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. CHAT SESSIONS TABLE
-- ============================================
CREATE TABLE public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT DEFAULT 'New Chat',
    jurisdiction TEXT DEFAULT 'pak',
    -- Context/Persona used for this chat
    role TEXT DEFAULT 'student', 
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_message_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_last_message ON public.chat_sessions(last_message_at DESC);

-- ============================================
-- 3. MESSAGES TABLE
-- ============================================
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'model')),
    content TEXT NOT NULL,
    tokens_used INTEGER DEFAULT 0,
    has_document BOOLEAN DEFAULT FALSE,
    document_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_session_id ON public.messages(session_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);

-- ============================================
-- 4. DOCUMENTS TABLE
-- ============================================
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL, -- Supabase Storage Path
    file_size INTEGER,
    file_type TEXT CHECK (file_type IN ('pdf', 'docx', 'txt')),
    document_type TEXT DEFAULT 'general' CHECK (document_type IN ('contract', 'case', 'statute', 'general')),
    analysis_json JSONB,
    risk_score INTEGER CHECK (risk_score >= 1 AND risk_score <= 10),
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    analyzed_at TIMESTAMPTZ
);

CREATE INDEX idx_documents_user_id ON public.documents(user_id);

-- ============================================
-- 5. USAGE TRACKING TABLE
-- ============================================
CREATE TABLE public.usage_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    messages_count INTEGER DEFAULT 0,
    documents_count INTEGER DEFAULT 0,
    tokens_used INTEGER DEFAULT 0,
    UNIQUE(user_id, date)
);

CREATE INDEX idx_usage_tracking_user_date ON public.usage_tracking(user_id, date);

-- ============================================
-- 6. TEMPLATES TABLE (For future use)
-- ============================================
CREATE TABLE public.templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('nda', 'service_agreement', 'employment', 'partnership', 'lease', 'freelance', 'other')),
    jurisdiction TEXT NOT NULL CHECK (jurisdiction IN ('pak', 'us', 'uk', 'all')),
    content TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only access their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Chat Sessions: Users can only access their own sessions
CREATE POLICY "Users can view own sessions" ON public.chat_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON public.chat_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON public.chat_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own sessions" ON public.chat_sessions FOR DELETE USING (auth.uid() = user_id);

-- Messages: Users can access messages in their sessions
CREATE POLICY "Users can view messages in own sessions" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.chat_sessions
            WHERE chat_sessions.id = messages.session_id
            AND chat_sessions.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert messages in own sessions" ON public.messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.chat_sessions
            WHERE chat_sessions.id = session_id
            AND chat_sessions.user_id = auth.uid()
        )
    );

-- Documents: Users can only access their own documents
CREATE POLICY "Users can view own documents" ON public.documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own documents" ON public.documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own documents" ON public.documents FOR DELETE USING (auth.uid() = user_id);

-- Usage Tracking: Users can view their own usage
CREATE POLICY "Users can view own usage" ON public.usage_tracking FOR SELECT USING (auth.uid() = user_id);
-- Only system should update usage really, but for now allow user context if triggered by RLS
CREATE POLICY "Users can update own usage" ON public.usage_tracking FOR ALL USING (auth.uid() = user_id);

-- Templates: Everyone can view active templates
CREATE POLICY "Anyone can view active templates" ON public.templates FOR SELECT USING (is_active = TRUE);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update last_message_at on new message
CREATE OR REPLACE FUNCTION public.update_session_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.chat_sessions
    SET last_message_at = NOW()
    WHERE id = NEW.session_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_message_insert ON public.messages;
CREATE TRIGGER on_message_insert
    AFTER INSERT ON public.messages
    FOR EACH ROW EXECUTE FUNCTION public.update_session_last_message();

-- Increment usage on message insert (Optional: better handled by backend logic to enforce limits before insert)
-- Keeping simple for now:
CREATE OR REPLACE FUNCTION public.increment_usage()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.usage_tracking (user_id, date, messages_count, tokens_used)
    SELECT 
        cs.user_id,
        CURRENT_DATE,
        1,
        COALESCE(NEW.tokens_used, 0)
    FROM public.chat_sessions cs
    WHERE cs.id = NEW.session_id
    ON CONFLICT (user_id, date)
    DO UPDATE SET 
        messages_count = usage_tracking.messages_count + 1,
        tokens_used = usage_tracking.tokens_used + COALESCE(EXCLUDED.tokens_used, 0);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

    AFTER INSERT ON public.messages
    FOR EACH ROW EXECUTE FUNCTION public.increment_usage();

-- ============================================
-- 7. WAITLIST TABLE (Early Access)
-- ============================================
CREATE TABLE public.waitlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'invited'))
);

-- Waitlist Policies
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow public to insert (Apply for waitlist) via Anon key
CREATE POLICY "Public can insert into waitlist" ON public.waitlist
    FOR INSERT WITH CHECK (true);

-- Only admins/service role can view
CREATE POLICY "Admins can view waitlist" ON public.waitlist
    FOR SELECT USING (auth.role() = 'service_role');

