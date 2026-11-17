-- =====================================================================
-- Bitweg: Nachrichten loeschen und Chat leeren (Admin)
-- Einmal im Supabase SQL Editor ausfuehren (nach 02, 03 und 04). Kann erneut laufen.
--
--  - Jeder darf seine EIGENEN Nachrichten loeschen, im Chat und in Gruppen,
--    samt Bild bzw. Datei. Geloescht ist sie dann fuer alle.
--  - Wer in public.app_admins steht, darf zusaetzlich seine Chats mit einer
--    Person komplett leeren (auch die Nachrichten der anderen Person).
--  - Admin wird man NICHT ueber die App, nur hier im SQL Editor (siehe unten).
-- =====================================================================

-- ---------------------------------------------------------------- Admins

create table if not exists public.app_admins (
  user_id    uuid primary key references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.app_admins enable row level security;
-- keine Regeln: ueber die Webseite kann niemand die Liste lesen oder aendern
revoke all on public.app_admins from anon, authenticated;

create or replace function public.is_app_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.app_admins where user_id = auth.uid());
$$;
revoke execute on function public.is_app_admin() from public, anon;
grant execute on function public.is_app_admin() to authenticated;

-- ---------------------------------------------------------------- Chat (zwei Personen)

-- Eigene Nachrichten loeschen; Admins zusaetzlich alle Nachrichten ihrer eigenen Chats
drop policy if exists messages_delete on public.messages;
create policy messages_delete on public.messages for delete to authenticated
  using (
    sender = auth.uid()
    or (public.is_app_admin() and auth.uid() in (sender, recipient))
  );
grant delete on public.messages to authenticated;

-- Dateien: eigene gab es schon (chat_delete). Admins duerfen die Dateien ihrer Chats loeschen.
drop policy if exists chat_admin_delete on storage.objects;
create policy chat_admin_delete on storage.objects for delete to authenticated
  using (
    bucket_id = 'chat'
    and (storage.foldername(name))[1] <> 'g'
    and public.is_app_admin()
    and auth.uid()::text in ((storage.foldername(name))[1], (storage.foldername(name))[2])
  );

-- ---------------------------------------------------------------- Gruppen

drop policy if exists group_messages_delete on public.group_messages;
create policy group_messages_delete on public.group_messages for delete to authenticated
  using (sender = auth.uid());
grant delete on public.group_messages to authenticated;

drop policy if exists group_files_delete on storage.objects;
create policy group_files_delete on storage.objects for delete to authenticated
  using (
    bucket_id = 'chat'
    and (storage.foldername(name))[1] = 'g'
    and (storage.foldername(name))[3] = auth.uid()::text
  );

-- ---------------------------------------------------------------- Dich zum Admin machen
-- Diese Zeile einmal mit DEINEM Benutzernamen (ohne @) ausfuehren, z. B. 'tom':
--
--   insert into public.app_admins (user_id)
--   select id from public.profiles where username = 'DEIN_BENUTZERNAME'
--   on conflict do nothing;
--
-- Pruefen:   select p.username from public.app_admins a join public.profiles p on p.id = a.user_id;
-- Entfernen: delete from public.app_admins where user_id = (select id from public.profiles where username = '...');
