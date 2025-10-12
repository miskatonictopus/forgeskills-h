


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
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
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."heartbeat"() RETURNS timestamp with time zone
    LANGUAGE "sql" STABLE
    AS $$
  select now();
$$;


ALTER FUNCTION "public"."heartbeat"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."tg_set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at := now();
  return new;
end $$;


ALTER FUNCTION "public"."tg_set_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."configuracion" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "nombre_centro" "text",
    "zona_horaria" "text" DEFAULT 'Europe/Madrid'::"text",
    "idioma" "text" DEFAULT 'es'::"text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."configuracion" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."curso_lectivo" (
    "user_id" "uuid" NOT NULL,
    "inicio" "date" NOT NULL,
    "fin" "date" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."curso_lectivo" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."perfil" (
    "user_id" "uuid" NOT NULL,
    "nombre" "text",
    "centro" "text",
    "curso_inicio" "date",
    "curso_fin" "date",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."perfil" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."perfil_docente" (
    "user_id" "uuid" NOT NULL,
    "docente" "text" DEFAULT ''::"text" NOT NULL,
    "centro" "text" DEFAULT ''::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."perfil_docente" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "full_name" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


ALTER TABLE ONLY "public"."configuracion"
    ADD CONSTRAINT "configuracion_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."configuracion"
    ADD CONSTRAINT "configuracion_tenant_id_key" UNIQUE ("tenant_id");



ALTER TABLE ONLY "public"."curso_lectivo"
    ADD CONSTRAINT "curso_lectivo_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."perfil_docente"
    ADD CONSTRAINT "perfil_docente_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."perfil_docente"
    ADD CONSTRAINT "perfil_docente_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."perfil"
    ADD CONSTRAINT "perfil_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



CREATE UNIQUE INDEX "profiles_email_unique" ON "public"."profiles" USING "btree" ("lower"("email"));



CREATE OR REPLACE TRIGGER "set_updated_at_curso_lectivo" BEFORE UPDATE ON "public"."curso_lectivo" FOR EACH ROW EXECUTE FUNCTION "public"."tg_set_updated_at"();



ALTER TABLE ONLY "public"."curso_lectivo"
    ADD CONSTRAINT "curso_lectivo_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."perfil_docente"
    ADD CONSTRAINT "perfil_docente_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."perfil"
    ADD CONSTRAINT "perfil_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE "public"."configuracion" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "curso_insert_own" ON "public"."curso_lectivo" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."curso_lectivo" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "curso_select_own" ON "public"."curso_lectivo" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "curso_update_own" ON "public"."curso_lectivo" FOR UPDATE USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "owner_can_all" ON "public"."configuracion" USING (("tenant_id" = "auth"."uid"())) WITH CHECK (("tenant_id" = "auth"."uid"()));



ALTER TABLE "public"."perfil" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."perfil_docente" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "perfil_docente_insert_own" ON "public"."perfil_docente" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "perfil_docente_select_own" ON "public"."perfil_docente" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "perfil_docente_update_own" ON "public"."perfil_docente" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "perfil_insert_own" ON "public"."perfil" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "perfil_select_own" ON "public"."perfil" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "perfil_update_own" ON "public"."perfil" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "profiles_insert_own" ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "profiles_select_own" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "profiles_update_own" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "solo propietario" ON "public"."configuracion" USING (("tenant_id" = "auth"."uid"())) WITH CHECK (("tenant_id" = "auth"."uid"()));





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."heartbeat"() TO "anon";
GRANT ALL ON FUNCTION "public"."heartbeat"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."heartbeat"() TO "service_role";



GRANT ALL ON FUNCTION "public"."tg_set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."tg_set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."tg_set_updated_at"() TO "service_role";


















GRANT ALL ON TABLE "public"."configuracion" TO "anon";
GRANT ALL ON TABLE "public"."configuracion" TO "authenticated";
GRANT ALL ON TABLE "public"."configuracion" TO "service_role";



GRANT ALL ON TABLE "public"."curso_lectivo" TO "anon";
GRANT ALL ON TABLE "public"."curso_lectivo" TO "authenticated";
GRANT ALL ON TABLE "public"."curso_lectivo" TO "service_role";



GRANT ALL ON TABLE "public"."perfil" TO "anon";
GRANT ALL ON TABLE "public"."perfil" TO "authenticated";
GRANT ALL ON TABLE "public"."perfil" TO "service_role";



GRANT ALL ON TABLE "public"."perfil_docente" TO "anon";
GRANT ALL ON TABLE "public"."perfil_docente" TO "authenticated";
GRANT ALL ON TABLE "public"."perfil_docente" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































RESET ALL;
