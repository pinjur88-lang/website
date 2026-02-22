DROP POLICY IF EXISTS "Users can read their own request" ON requests;
CREATE POLICY "Users can read their own request" ON requests FOR
SELECT TO authenticated USING (email = auth.jwt()->>'email');