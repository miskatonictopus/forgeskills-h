create table "public"."configuracion" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null default auth.uid(),
    "nombre_centro" text,
    "zona_horaria" text default 'Europe/Madrid'::text,
    "idioma" text default 'es'::text,
    "created_at" timestamp with time zone default now()
);


alter table "public"."configuracion" enable row level security;

create table "public"."curso_lectivo" (
    "user_id" uuid not null,
    "inicio" date not null,
    "fin" date not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."curso_lectivo" enable row level security;

create table "public"."perfil" (
    "user_id" uuid not null,
    "nombre" text,
    "centro" text,
    "curso_inicio" date,
    "curso_fin" date,
    "created_at" timestamp with time zone default now()
);


alter table "public"."perfil" enable row level security;

create table "public"."perfil_docente" (
    "user_id" uuid not null,
    "docente" text not null default ''::text,
    "centro" text not null default ''::text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."perfil_docente" enable row level security;

create table "public"."profiles" (
    "id" uuid not null,
    "email" text not null,
    "full_name" text,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."profiles" enable row level security;

CREATE UNIQUE INDEX configuracion_pkey ON public.configuracion USING btree (id);

CREATE UNIQUE INDEX configuracion_tenant_id_key ON public.configuracion USING btree (tenant_id);

CREATE UNIQUE INDEX curso_lectivo_pkey ON public.curso_lectivo USING btree (user_id);

CREATE UNIQUE INDEX perfil_docente_pkey ON public.perfil_docente USING btree (user_id);

CREATE UNIQUE INDEX perfil_docente_user_id_key ON public.perfil_docente USING btree (user_id);

CREATE UNIQUE INDEX perfil_pkey ON public.perfil USING btree (user_id);

CREATE INDEX profiles_created_at_idx ON public.profiles USING btree (created_at DESC);

CREATE UNIQUE INDEX profiles_email_unique ON public.profiles USING btree (lower(email));

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

alter table "public"."configuracion" add constraint "configuracion_pkey" PRIMARY KEY using index "configuracion_pkey";

alter table "public"."curso_lectivo" add constraint "curso_lectivo_pkey" PRIMARY KEY using index "curso_lectivo_pkey";

alter table "public"."perfil" add constraint "perfil_pkey" PRIMARY KEY using index "perfil_pkey";

alter table "public"."perfil_docente" add constraint "perfil_docente_pkey" PRIMARY KEY using index "perfil_docente_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."configuracion" add constraint "configuracion_tenant_id_key" UNIQUE using index "configuracion_tenant_id_key";

alter table "public"."curso_lectivo" add constraint "curso_lectivo_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."curso_lectivo" validate constraint "curso_lectivo_user_id_fkey";

alter table "public"."perfil" add constraint "perfil_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."perfil" validate constraint "perfil_user_id_fkey";

alter table "public"."perfil_docente" add constraint "perfil_docente_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."perfil_docente" validate constraint "perfil_docente_user_id_fkey";

alter table "public"."perfil_docente" add constraint "perfil_docente_user_id_key" UNIQUE using index "perfil_docente_user_id_key";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

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

grant delete on table "public"."configuracion" to "anon";

grant insert on table "public"."configuracion" to "anon";

grant references on table "public"."configuracion" to "anon";

grant select on table "public"."configuracion" to "anon";

grant trigger on table "public"."configuracion" to "anon";

grant truncate on table "public"."configuracion" to "anon";

grant update on table "public"."configuracion" to "anon";

grant delete on table "public"."configuracion" to "authenticated";

grant insert on table "public"."configuracion" to "authenticated";

grant references on table "public"."configuracion" to "authenticated";

grant select on table "public"."configuracion" to "authenticated";

grant trigger on table "public"."configuracion" to "authenticated";

grant truncate on table "public"."configuracion" to "authenticated";

grant update on table "public"."configuracion" to "authenticated";

grant delete on table "public"."configuracion" to "service_role";

grant insert on table "public"."configuracion" to "service_role";

grant references on table "public"."configuracion" to "service_role";

grant select on table "public"."configuracion" to "service_role";

grant trigger on table "public"."configuracion" to "service_role";

grant truncate on table "public"."configuracion" to "service_role";

grant update on table "public"."configuracion" to "service_role";

grant delete on table "public"."curso_lectivo" to "anon";

grant insert on table "public"."curso_lectivo" to "anon";

grant references on table "public"."curso_lectivo" to "anon";

grant select on table "public"."curso_lectivo" to "anon";

grant trigger on table "public"."curso_lectivo" to "anon";

grant truncate on table "public"."curso_lectivo" to "anon";

grant update on table "public"."curso_lectivo" to "anon";

grant delete on table "public"."curso_lectivo" to "authenticated";

grant insert on table "public"."curso_lectivo" to "authenticated";

grant references on table "public"."curso_lectivo" to "authenticated";

grant select on table "public"."curso_lectivo" to "authenticated";

grant trigger on table "public"."curso_lectivo" to "authenticated";

grant truncate on table "public"."curso_lectivo" to "authenticated";

grant update on table "public"."curso_lectivo" to "authenticated";

grant delete on table "public"."curso_lectivo" to "service_role";

grant insert on table "public"."curso_lectivo" to "service_role";

grant references on table "public"."curso_lectivo" to "service_role";

grant select on table "public"."curso_lectivo" to "service_role";

grant trigger on table "public"."curso_lectivo" to "service_role";

grant truncate on table "public"."curso_lectivo" to "service_role";

grant update on table "public"."curso_lectivo" to "service_role";

grant delete on table "public"."perfil" to "anon";

grant insert on table "public"."perfil" to "anon";

grant references on table "public"."perfil" to "anon";

grant select on table "public"."perfil" to "anon";

grant trigger on table "public"."perfil" to "anon";

grant truncate on table "public"."perfil" to "anon";

grant update on table "public"."perfil" to "anon";

grant delete on table "public"."perfil" to "authenticated";

grant insert on table "public"."perfil" to "authenticated";

grant references on table "public"."perfil" to "authenticated";

grant select on table "public"."perfil" to "authenticated";

grant trigger on table "public"."perfil" to "authenticated";

grant truncate on table "public"."perfil" to "authenticated";

grant update on table "public"."perfil" to "authenticated";

grant delete on table "public"."perfil" to "service_role";

grant insert on table "public"."perfil" to "service_role";

grant references on table "public"."perfil" to "service_role";

grant select on table "public"."perfil" to "service_role";

grant trigger on table "public"."perfil" to "service_role";

grant truncate on table "public"."perfil" to "service_role";

grant update on table "public"."perfil" to "service_role";

grant delete on table "public"."perfil_docente" to "anon";

grant insert on table "public"."perfil_docente" to "anon";

grant references on table "public"."perfil_docente" to "anon";

grant select on table "public"."perfil_docente" to "anon";

grant trigger on table "public"."perfil_docente" to "anon";

grant truncate on table "public"."perfil_docente" to "anon";

grant update on table "public"."perfil_docente" to "anon";

grant delete on table "public"."perfil_docente" to "authenticated";

grant insert on table "public"."perfil_docente" to "authenticated";

grant references on table "public"."perfil_docente" to "authenticated";

grant select on table "public"."perfil_docente" to "authenticated";

grant trigger on table "public"."perfil_docente" to "authenticated";

grant truncate on table "public"."perfil_docente" to "authenticated";

grant update on table "public"."perfil_docente" to "authenticated";

grant delete on table "public"."perfil_docente" to "service_role";

grant insert on table "public"."perfil_docente" to "service_role";

grant references on table "public"."perfil_docente" to "service_role";

grant select on table "public"."perfil_docente" to "service_role";

grant trigger on table "public"."perfil_docente" to "service_role";

grant truncate on table "public"."perfil_docente" to "service_role";

grant update on table "public"."perfil_docente" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

create policy "owner_can_all"
on "public"."configuracion"
as permissive
for all
to public
using ((tenant_id = auth.uid()))
with check ((tenant_id = auth.uid()));


create policy "solo propietario"
on "public"."configuracion"
as permissive
for all
to public
using ((tenant_id = auth.uid()))
with check ((tenant_id = auth.uid()));


create policy "curso_insert_own"
on "public"."curso_lectivo"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "curso_select_own"
on "public"."curso_lectivo"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "curso_update_own"
on "public"."curso_lectivo"
as permissive
for update
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "perfil_insert_own"
on "public"."perfil"
as permissive
for insert
to authenticated
with check ((auth.uid() = user_id));


create policy "perfil_select_own"
on "public"."perfil"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));


create policy "perfil_update_own"
on "public"."perfil"
as permissive
for update
to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "perfil_docente_insert_own"
on "public"."perfil_docente"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "perfil_docente_select_own"
on "public"."perfil_docente"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "perfil_docente_update_own"
on "public"."perfil_docente"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "profiles_insert_own"
on "public"."profiles"
as permissive
for insert
to public
with check ((auth.uid() = id));


create policy "profiles_select_own"
on "public"."profiles"
as permissive
for select
to public
using ((auth.uid() = id));


create policy "profiles_update_own"
on "public"."profiles"
as permissive
for update
to public
using ((auth.uid() = id))
with check ((auth.uid() = id));


CREATE TRIGGER set_updated_at_curso_lectivo BEFORE UPDATE ON public.curso_lectivo FOR EACH ROW EXECUTE FUNCTION tg_set_updated_at();


