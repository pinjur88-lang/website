-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    user_email TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    subject TEXT,
    message TEXT NOT NULL,
    
    read BOOLEAN DEFAULT FALSE,
    admin_notes TEXT
);

-- RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- 1. Admins can view all messages
CREATE POLICY "Admins can view all messages"
ON contact_messages FOR SELECT
USING (auth.jwt() ->> 'email' = 'udrugabaljci@gmail.com');

-- 2. Authenticated users can insert messages
CREATE POLICY "Users can insert messages"
ON contact_messages FOR INSERT
TO authenticated
WITH CHECK (true);

-- 3. Users can view their OWN messages (optional, for history)
CREATE POLICY "Users can view own messages"
ON contact_messages FOR SELECT
USING (user_email = (auth.jwt() ->> 'email'));
