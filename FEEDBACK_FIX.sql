-- ==========================================
-- CLEANUP VOTING & CONTACT SETUP
-- ==========================================

-- 1. CLEANUP POLLS (Reset to 1 example)
DELETE FROM polls; -- Cascades to poll_votes

INSERT INTO polls (title, description, options, end_date)
VALUES (
  'Primjer Glasovanja: Prioriteti Projekata',
  'Ovo je primjer aktivne ankete. Kao Silver član, možete glasati za jednu od opcija.',
  ARRAY['Obnova seoskog doma', 'Uređenje puta do crkve', 'Javna rasvjeta'],
  now() + interval '90 days'
);

-- 2. SETUP CONTACT MESSAGES (If not exists)
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

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Admins view all
DROP POLICY IF EXISTS "Admins can view all messages" ON contact_messages;
CREATE POLICY "Admins can view all messages"
ON contact_messages FOR SELECT
USING (auth.jwt() ->> 'email' = 'udrugabaljci@gmail.com');

-- Users insert
DROP POLICY IF EXISTS "Users can insert messages" ON contact_messages;
CREATE POLICY "Users can insert messages"
ON contact_messages FOR INSERT
TO authenticated
WITH CHECK (true);
