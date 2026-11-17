-- =====================================================================
-- Bitweg: rotes "Admin"-Abzeichen neben dem Namen
-- Einmal im Supabase SQL Editor ausfuehren (nach 06). Kann erneut laufen.
--
-- Die Tabelle app_admins bleibt geschuetzt. Diese Funktion verraet nur,
-- WELCHE Konten Admin sind, damit die App das Abzeichen zeigen kann.
-- =====================================================================

create or replace function public.app_admin_ids() returns setof uuid
language sql stable security definer set search_path = public as $$
  select user_id from public.app_admins;
$$;
revoke execute on function public.app_admin_ids() from public, anon;
grant execute on function public.app_admin_ids() to authenticated;
