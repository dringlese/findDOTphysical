-- Run this in Supabase SQL Editor if your examiners table already exists
-- Adds fax and website columns (safe to run multiple times)

alter table public.examiners
  add column if not exists fax     text,
  add column if not exists website text;
