-- =====================================================================
-- Bitweg: Anmelden mit Google und Apple
-- Einmal im Supabase SQL Editor ausfuehren (New query, einfuegen, Run).
-- Kann gefahrlos erneut ausgefuehrt werden.
--
-- Wer sich mit Google oder Apple anmeldet, bringt keinen Benutzernamen mit.
-- Bisher wuerde das Anlegen des Profils dann scheitern. Ab jetzt denkt sich
-- die Datenbank einen freien Benutzernamen aus (aus Name oder E-Mail).
-- Die App fragt danach einmal nach, ob man ihn behalten oder aendern will.
-- Registrierung mit E-Mail und Passwort bleibt genau wie vorher.
-- =====================================================================

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  meta      jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  wanted    text  := lower(meta ->> 'username');
  base      text;
  candidate text;
  tries     int   := 0;
begin
  if wanted is not null then
    -- E-Mail-Registrierung: Benutzername kommt aus der App (wie bisher)
    candidate := wanted;
  else
    -- Google / Apple: aus dem Namen oder dem Teil der E-Mail vor dem @ bauen
    base := lower(coalesce(
      nullif(btrim(meta ->> 'full_name'), ''),
      nullif(btrim(meta ->> 'name'), ''),
      split_part(coalesce(new.email, ''), '@', 1)));
    base := replace(replace(replace(replace(base, 'ä', 'ae'), 'ö', 'oe'), 'ü', 'ue'), 'ß', 'ss');
    base := regexp_replace(base, '[^a-z0-9]+', '_', 'g');
    base := left(btrim(base, '_'), 14);
    base := btrim(base, '_');
    if char_length(base) < 3 then base := 'coder'; end if;

    candidate := base;
    while exists (select 1 from public.profiles where username = candidate) loop
      tries := tries + 1;
      if tries > 25 then
        candidate := 'coder_' || left(replace(new.id::text, '-', ''), 12);
        exit;
      end if;
      candidate := base || '_' || (1000 + floor(random() * 9000))::int;
    end loop;
  end if;

  insert into public.profiles (id, username, name)
  values (
    new.id,
    candidate,
    coalesce(left(coalesce(nullif(btrim(meta ->> 'name'), ''), nullif(btrim(meta ->> 'full_name'), '')), 40), '')
  );
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
