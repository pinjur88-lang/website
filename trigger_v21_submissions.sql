-- Submissions Table for Admin Inbox (Dumping Reports & Suggestions)
CREATE TABLE IF NOT EXISTS public.user_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- "dumping" or "suggestion"
    type TEXT NOT NULL,
    -- Submitter info (can be empty if anonymous, but we usually have email/name)
    user_id UUID REFERENCES auth.users(id) ON DELETE
    SET NULL,
        user_email TEXT,
        user_name TEXT,
        -- Content
        content TEXT NOT NULL,
        location TEXT,
        -- Only for dumping
        -- Status tracking
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved')),
        admin_notes TEXT,
        resolved_at TIMESTAMPTZ
);
-- Enable RLS
ALTER TABLE public.user_submissions ENABLE ROW LEVEL SECURITY;
-- 1. Admins can view and update everything
CREATE POLICY "Admins can view all submissions" ON public.user_submissions FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = auth.uid()
                AND profiles.role = 'admin'
        )
    );
CREATE POLICY "Admins can update submissions" ON public.user_submissions FOR
UPDATE USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = auth.uid()
                AND profiles.role = 'admin'
        )
    );
CREATE POLICY "Admins can delete submissions" ON public.user_submissions FOR DELETE USING (
    EXISTS (
        SELECT 1
        FROM profiles
        WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
    )
);
-- 2. Authenticated users can insert their own submissions
CREATE POLICY "Users can insert submissions" ON public.user_submissions FOR
INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
-- 3. Anonymous users can insert suggestions (optional, but good for dumping if they aren't logged in)
-- Allow public inserts since the /dumping page might be accessed by standard users not fully logged in
-- If we want to strictly enforce login before submitting, we can drop this. Let's allow authenticated only for now based on the app flow.
-- Actually, /dumping and /suggestions are public pages. We will allow public inserts (checked carefully server-side).
CREATE POLICY "Public can insert submissions" ON public.user_submissions FOR
INSERT WITH CHECK (true);