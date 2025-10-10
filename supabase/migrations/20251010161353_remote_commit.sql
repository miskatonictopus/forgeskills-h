revoke delete on table "public"."configuracion" from "anon";

revoke insert on table "public"."configuracion" from "anon";

revoke references on table "public"."configuracion" from "anon";

revoke select on table "public"."configuracion" from "anon";

revoke trigger on table "public"."configuracion" from "anon";

revoke truncate on table "public"."configuracion" from "anon";

revoke update on table "public"."configuracion" from "anon";

revoke delete on table "public"."configuracion" from "authenticated";

revoke insert on table "public"."configuracion" from "authenticated";

revoke references on table "public"."configuracion" from "authenticated";

revoke select on table "public"."configuracion" from "authenticated";

revoke trigger on table "public"."configuracion" from "authenticated";

revoke truncate on table "public"."configuracion" from "authenticated";

revoke update on table "public"."configuracion" from "authenticated";

revoke delete on table "public"."configuracion" from "service_role";

revoke insert on table "public"."configuracion" from "service_role";

revoke references on table "public"."configuracion" from "service_role";

revoke select on table "public"."configuracion" from "service_role";

revoke trigger on table "public"."configuracion" from "service_role";

revoke truncate on table "public"."configuracion" from "service_role";

revoke update on table "public"."configuracion" from "service_role";

revoke delete on table "public"."curso_lectivo" from "anon";

revoke insert on table "public"."curso_lectivo" from "anon";

revoke references on table "public"."curso_lectivo" from "anon";

revoke select on table "public"."curso_lectivo" from "anon";

revoke trigger on table "public"."curso_lectivo" from "anon";

revoke truncate on table "public"."curso_lectivo" from "anon";

revoke update on table "public"."curso_lectivo" from "anon";

revoke delete on table "public"."curso_lectivo" from "authenticated";

revoke insert on table "public"."curso_lectivo" from "authenticated";

revoke references on table "public"."curso_lectivo" from "authenticated";

revoke select on table "public"."curso_lectivo" from "authenticated";

revoke trigger on table "public"."curso_lectivo" from "authenticated";

revoke truncate on table "public"."curso_lectivo" from "authenticated";

revoke update on table "public"."curso_lectivo" from "authenticated";

revoke delete on table "public"."curso_lectivo" from "service_role";

revoke insert on table "public"."curso_lectivo" from "service_role";

revoke references on table "public"."curso_lectivo" from "service_role";

revoke select on table "public"."curso_lectivo" from "service_role";

revoke trigger on table "public"."curso_lectivo" from "service_role";

revoke truncate on table "public"."curso_lectivo" from "service_role";

revoke update on table "public"."curso_lectivo" from "service_role";

revoke delete on table "public"."perfil" from "anon";

revoke insert on table "public"."perfil" from "anon";

revoke references on table "public"."perfil" from "anon";

revoke select on table "public"."perfil" from "anon";

revoke trigger on table "public"."perfil" from "anon";

revoke truncate on table "public"."perfil" from "anon";

revoke update on table "public"."perfil" from "anon";

revoke delete on table "public"."perfil" from "authenticated";

revoke insert on table "public"."perfil" from "authenticated";

revoke references on table "public"."perfil" from "authenticated";

revoke select on table "public"."perfil" from "authenticated";

revoke trigger on table "public"."perfil" from "authenticated";

revoke truncate on table "public"."perfil" from "authenticated";

revoke update on table "public"."perfil" from "authenticated";

revoke delete on table "public"."perfil" from "service_role";

revoke insert on table "public"."perfil" from "service_role";

revoke references on table "public"."perfil" from "service_role";

revoke select on table "public"."perfil" from "service_role";

revoke trigger on table "public"."perfil" from "service_role";

revoke truncate on table "public"."perfil" from "service_role";

revoke update on table "public"."perfil" from "service_role";

revoke delete on table "public"."perfil_docente" from "anon";

revoke insert on table "public"."perfil_docente" from "anon";

revoke references on table "public"."perfil_docente" from "anon";

revoke select on table "public"."perfil_docente" from "anon";

revoke trigger on table "public"."perfil_docente" from "anon";

revoke truncate on table "public"."perfil_docente" from "anon";

revoke update on table "public"."perfil_docente" from "anon";

revoke delete on table "public"."perfil_docente" from "authenticated";

revoke insert on table "public"."perfil_docente" from "authenticated";

revoke references on table "public"."perfil_docente" from "authenticated";

revoke select on table "public"."perfil_docente" from "authenticated";

revoke trigger on table "public"."perfil_docente" from "authenticated";

revoke truncate on table "public"."perfil_docente" from "authenticated";

revoke update on table "public"."perfil_docente" from "authenticated";

revoke delete on table "public"."perfil_docente" from "service_role";

revoke insert on table "public"."perfil_docente" from "service_role";

revoke references on table "public"."perfil_docente" from "service_role";

revoke select on table "public"."perfil_docente" from "service_role";

revoke trigger on table "public"."perfil_docente" from "service_role";

revoke truncate on table "public"."perfil_docente" from "service_role";

revoke update on table "public"."perfil_docente" from "service_role";

revoke delete on table "public"."profiles" from "anon";

revoke insert on table "public"."profiles" from "anon";

revoke references on table "public"."profiles" from "anon";

revoke select on table "public"."profiles" from "anon";

revoke trigger on table "public"."profiles" from "anon";

revoke truncate on table "public"."profiles" from "anon";

revoke update on table "public"."profiles" from "anon";

revoke delete on table "public"."profiles" from "authenticated";

revoke insert on table "public"."profiles" from "authenticated";

revoke references on table "public"."profiles" from "authenticated";

revoke select on table "public"."profiles" from "authenticated";

revoke trigger on table "public"."profiles" from "authenticated";

revoke truncate on table "public"."profiles" from "authenticated";

revoke update on table "public"."profiles" from "authenticated";

revoke delete on table "public"."profiles" from "service_role";

revoke insert on table "public"."profiles" from "service_role";

revoke references on table "public"."profiles" from "service_role";

revoke select on table "public"."profiles" from "service_role";

revoke trigger on table "public"."profiles" from "service_role";

revoke truncate on table "public"."profiles" from "service_role";

revoke update on table "public"."profiles" from "service_role";

drop index if exists "public"."profiles_created_at_idx";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', null)
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(excluded.full_name, public.profiles.full_name);

  insert into public.configuracion (tenant_id)
  values (new.id)
  on conflict (tenant_id) do nothing;

  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.heartbeat()
 RETURNS timestamp with time zone
 LANGUAGE sql
 STABLE
AS $function$
  select now();
$function$
;

CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.updated_at := now();
  return new;
end $function$
;


CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();


