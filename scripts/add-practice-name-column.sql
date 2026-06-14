-- Run this in Supabase SQL Editor if your examiners table already exists
-- Adds a separate practice/clinic name field for provider + practice search

alter table public.examiners
  add column if not exists practice_name text;
