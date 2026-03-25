-- 1. Create the messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    read BOOLEAN DEFAULT false NOT NULL
);

-- 2. Add Row Level Security (RLS) to ensure privacy
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only read their own messages"
    ON public.messages
    FOR SELECT
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert messages they send"
    ON public.messages
    FOR INSERT
    WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update read status on received messages"
    ON public.messages
    FOR UPDATE
    USING (auth.uid() = receiver_id)
    WITH CHECK (auth.uid() = receiver_id);

-- 3. Enable Realtime subscriptions (optional, for future live chat)
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
