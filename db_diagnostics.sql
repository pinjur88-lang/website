-- check RLS on requests table
select * from pg_policies where tablename = 'requests';
