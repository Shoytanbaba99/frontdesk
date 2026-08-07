-- FrontDesk Initial PostgreSQL Schema Migration
-- Migration Timestamp: 2026-08-08 00:00:00

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'AVAILABLE',
    theme_color TEXT NOT NULL DEFAULT '#2563EB',
    bio TEXT,
    avatar_url TEXT,
    cover_image_url TEXT,
    github_url TEXT,
    x_url TEXT,
    website_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create Service Blocks Table
CREATE TABLE IF NOT EXISTS public.blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price_cents INTEGER NOT NULL DEFAULT 0,
    category TEXT NOT NULL DEFAULT 'General',
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create Requests Table
CREATE TABLE IF NOT EXISTS public.requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    block_id UUID REFERENCES public.blocks(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- 5. Row Level Security Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public blocks are viewable by everyone" ON public.blocks FOR SELECT USING (true);
CREATE POLICY "Users can manage own blocks" ON public.blocks FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert requests" ON public.requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Providers can view own requests" ON public.requests FOR SELECT USING (auth.uid() = provider_id);
CREATE POLICY "Providers can update own requests" ON public.requests FOR UPDATE USING (auth.uid() = provider_id);
CREATE POLICY "Providers can delete own requests" ON public.requests FOR DELETE USING (auth.uid() = provider_id);

-- 6. Grant Permissions
GRANT DELETE ON public.requests TO authenticated;
