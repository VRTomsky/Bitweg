-- =====================================================================
-- Bitweg: groessere Gruppen fuer Schulklassen
-- Einmal im Supabase SQL Editor ausfuehren (nach 03). Kann erneut laufen.
--
-- Bisher hoechstens 30 Mitglieder pro Gruppe: Eine Klasse mit 30 Schuelern
-- plus Lehrkraft passte nicht hinein. Jetzt sind es hoechstens 60.
-- =====================================================================

create or replace function public.group_limit_members() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.group_members where group_id = new.group_id) >= 60 then
    raise exception 'Die Gruppe ist voll (60 Mitglieder).';
  end if;
  return new;
end;
$$;
