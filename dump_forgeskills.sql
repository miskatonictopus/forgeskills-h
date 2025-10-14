


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


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



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


CREATE TABLE IF NOT EXISTS "public"."asignaturas" (
    "id" "text" NOT NULL,
    "nombre" "text" NOT NULL,
    "color" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "codigo" "text",
    "descripcion" "jsonb",
    "duracion" "text",
    "horas" numeric,
    "horas_totales" numeric,
    "id_uuid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."asignaturas" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."configuracion" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "nombre_centro" "text",
    "zona_horaria" "text" DEFAULT 'Europe/Madrid'::"text",
    "idioma" "text" DEFAULT 'es'::"text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."configuracion" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."criterios_evaluacion" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "ra_id" "uuid" NOT NULL,
    "codigo" "text" NOT NULL,
    "descripcion" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."criterios_evaluacion" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."curso_asignaturas" (
    "id" "text" DEFAULT "gen_random_uuid"() NOT NULL,
    "asignatura_nombre" "text",
    "color" "text",
    "curso_id" "uuid" NOT NULL,
    "asignatura_id" "uuid" NOT NULL
);


ALTER TABLE "public"."curso_asignaturas" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."curso_lectivo" (
    "user_id" "uuid" NOT NULL,
    "inicio" "date" NOT NULL,
    "fin" "date" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."curso_lectivo" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cursos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "acronimo" "text" NOT NULL,
    "nombre" "text" NOT NULL,
    "nivel" "text" NOT NULL,
    "grado" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE ONLY "public"."cursos" REPLICA IDENTITY FULL;


ALTER TABLE "public"."cursos" OWNER TO "postgres";


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


CREATE TABLE IF NOT EXISTS "public"."resultados_aprendizaje" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "codigo" "text" NOT NULL,
    "titulo" "text",
    "descripcion" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "asignatura_id" "uuid" NOT NULL
);


ALTER TABLE "public"."resultados_aprendizaje" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_settings" (
    "user_id" "uuid" NOT NULL,
    "theme" "text" DEFAULT 'system'::"text",
    "language" "text" DEFAULT 'es'::"text",
    "week_starts_on" integer DEFAULT 1,
    "calendar_default_color" "text" DEFAULT '#8b5cf6'::"text",
    "notifications_email" boolean DEFAULT true,
    "notifications_push" boolean DEFAULT false,
    "full_name" "text",
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_settings" OWNER TO "postgres";


ALTER TABLE ONLY "public"."asignaturas"
    ADD CONSTRAINT "asignaturas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."configuracion"
    ADD CONSTRAINT "configuracion_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."configuracion"
    ADD CONSTRAINT "configuracion_tenant_id_key" UNIQUE ("tenant_id");



ALTER TABLE ONLY "public"."criterios_evaluacion"
    ADD CONSTRAINT "criterios_evaluacion_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."curso_asignaturas"
    ADD CONSTRAINT "curso_asignaturas_pkey" PRIMARY KEY ("curso_id", "asignatura_id");



ALTER TABLE ONLY "public"."curso_lectivo"
    ADD CONSTRAINT "curso_lectivo_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."cursos"
    ADD CONSTRAINT "cursos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."perfil_docente"
    ADD CONSTRAINT "perfil_docente_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."perfil_docente"
    ADD CONSTRAINT "perfil_docente_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."perfil"
    ADD CONSTRAINT "perfil_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."resultados_aprendizaje"
    ADD CONSTRAINT "resultados_aprendizaje_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_settings"
    ADD CONSTRAINT "user_settings_pkey" PRIMARY KEY ("user_id");



CREATE UNIQUE INDEX "asignaturas_codigo_key" ON "public"."asignaturas" USING "btree" ("codigo") WHERE ("codigo" IS NOT NULL);



CREATE UNIQUE INDEX "asignaturas_id_uuid_unique" ON "public"."asignaturas" USING "btree" ("id_uuid");



CREATE INDEX "idx_ce_ra" ON "public"."criterios_evaluacion" USING "btree" ("ra_id");



CREATE INDEX "idx_curso_asig_asig" ON "public"."curso_asignaturas" USING "btree" ("asignatura_id");



CREATE INDEX "idx_curso_asig_curso" ON "public"."curso_asignaturas" USING "btree" ("curso_id");



CREATE INDEX "profiles_created_at_idx" ON "public"."profiles" USING "btree" ("created_at" DESC);



CREATE UNIQUE INDEX "profiles_email_unique" ON "public"."profiles" USING "btree" ("lower"("email"));



CREATE UNIQUE INDEX "uq_ce_ra_codigo" ON "public"."criterios_evaluacion" USING "btree" ("ra_id", "codigo");



CREATE OR REPLACE TRIGGER "set_updated_at_curso_lectivo" BEFORE UPDATE ON "public"."curso_lectivo" FOR EACH ROW EXECUTE FUNCTION "public"."tg_set_updated_at"();



ALTER TABLE ONLY "public"."criterios_evaluacion"
    ADD CONSTRAINT "criterios_evaluacion_ra_id_fkey" FOREIGN KEY ("ra_id") REFERENCES "public"."resultados_aprendizaje"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."curso_lectivo"
    ADD CONSTRAINT "curso_lectivo_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."curso_asignaturas"
    ADD CONSTRAINT "fk_asignatura" FOREIGN KEY ("asignatura_id") REFERENCES "public"."asignaturas"("id_uuid") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."curso_asignaturas"
    ADD CONSTRAINT "fk_curso" FOREIGN KEY ("curso_id") REFERENCES "public"."cursos"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."perfil_docente"
    ADD CONSTRAINT "perfil_docente_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."perfil"
    ADD CONSTRAINT "perfil_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."resultados_aprendizaje"
    ADD CONSTRAINT "resultados_aprendizaje_asignatura_id_uuid_fkey" FOREIGN KEY ("asignatura_id") REFERENCES "public"."asignaturas"("id_uuid") ON DELETE CASCADE;



CREATE POLICY "anon insert curso_asignaturas" ON "public"."curso_asignaturas" FOR INSERT TO "anon" WITH CHECK (true);



CREATE POLICY "anon select curso_asignaturas" ON "public"."curso_asignaturas" FOR SELECT TO "anon" USING (true);



CREATE POLICY "anon update curso_asignaturas" ON "public"."curso_asignaturas" FOR UPDATE TO "anon" USING (true) WITH CHECK (true);



CREATE POLICY "asig_delete_auth" ON "public"."asignaturas" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "asig_insert_auth" ON "public"."asignaturas" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "asig_select_auth" ON "public"."asignaturas" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "asig_update_auth" ON "public"."asignaturas" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



ALTER TABLE "public"."asignaturas" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "ce_delete_auth" ON "public"."criterios_evaluacion" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "ce_insert_auth" ON "public"."criterios_evaluacion" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "ce_select_auth" ON "public"."criterios_evaluacion" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "ce_update_auth" ON "public"."criterios_evaluacion" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



ALTER TABLE "public"."configuracion" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."criterios_evaluacion" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."curso_asignaturas" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "curso_asignaturas insert" ON "public"."curso_asignaturas" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "curso_asignaturas insert anon" ON "public"."curso_asignaturas" FOR INSERT TO "anon" WITH CHECK (true);



CREATE POLICY "curso_asignaturas select" ON "public"."curso_asignaturas" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "curso_asignaturas select anon" ON "public"."curso_asignaturas" FOR SELECT TO "anon" USING (true);



CREATE POLICY "curso_asignaturas update" ON "public"."curso_asignaturas" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "curso_asignaturas update anon" ON "public"."curso_asignaturas" FOR UPDATE TO "anon" USING (true) WITH CHECK (true);



CREATE POLICY "curso_insert_own" ON "public"."curso_lectivo" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."curso_lectivo" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "curso_select_own" ON "public"."curso_lectivo" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "curso_update_own" ON "public"."curso_lectivo" FOR UPDATE USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "insert curso_asignaturas for authenticated" ON "public"."curso_asignaturas" FOR INSERT TO "authenticated" WITH CHECK (true);



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



CREATE POLICY "ra_delete_auth" ON "public"."resultados_aprendizaje" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "ra_insert_auth" ON "public"."resultados_aprendizaje" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "ra_select_auth" ON "public"."resultados_aprendizaje" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "ra_update_auth" ON "public"."resultados_aprendizaje" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



ALTER TABLE "public"."resultados_aprendizaje" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "select curso_asignaturas for authenticated" ON "public"."curso_asignaturas" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "solo propietario" ON "public"."configuracion" USING (("tenant_id" = "auth"."uid"())) WITH CHECK (("tenant_id" = "auth"."uid"()));



CREATE POLICY "update curso_asignaturas for authenticated" ON "public"."curso_asignaturas" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



ALTER TABLE "public"."user_settings" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "user_settings anon select" ON "public"."user_settings" FOR SELECT TO "anon" USING (true);



CREATE POLICY "user_settings anon update" ON "public"."user_settings" FOR UPDATE TO "anon" USING (true) WITH CHECK (true);



CREATE POLICY "user_settings anon upsert" ON "public"."user_settings" FOR INSERT TO "anon" WITH CHECK (true);



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



GRANT ALL ON TABLE "public"."asignaturas" TO "anon";
GRANT ALL ON TABLE "public"."asignaturas" TO "authenticated";
GRANT ALL ON TABLE "public"."asignaturas" TO "service_role";



GRANT ALL ON TABLE "public"."configuracion" TO "anon";
GRANT ALL ON TABLE "public"."configuracion" TO "authenticated";
GRANT ALL ON TABLE "public"."configuracion" TO "service_role";



GRANT ALL ON TABLE "public"."criterios_evaluacion" TO "anon";
GRANT ALL ON TABLE "public"."criterios_evaluacion" TO "authenticated";
GRANT ALL ON TABLE "public"."criterios_evaluacion" TO "service_role";



GRANT ALL ON TABLE "public"."curso_asignaturas" TO "anon";
GRANT ALL ON TABLE "public"."curso_asignaturas" TO "authenticated";
GRANT ALL ON TABLE "public"."curso_asignaturas" TO "service_role";



GRANT ALL ON TABLE "public"."curso_lectivo" TO "anon";
GRANT ALL ON TABLE "public"."curso_lectivo" TO "authenticated";
GRANT ALL ON TABLE "public"."curso_lectivo" TO "service_role";



GRANT ALL ON TABLE "public"."cursos" TO "anon";
GRANT ALL ON TABLE "public"."cursos" TO "authenticated";
GRANT ALL ON TABLE "public"."cursos" TO "service_role";



GRANT ALL ON TABLE "public"."perfil" TO "anon";
GRANT ALL ON TABLE "public"."perfil" TO "authenticated";
GRANT ALL ON TABLE "public"."perfil" TO "service_role";



GRANT ALL ON TABLE "public"."perfil_docente" TO "anon";
GRANT ALL ON TABLE "public"."perfil_docente" TO "authenticated";
GRANT ALL ON TABLE "public"."perfil_docente" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."resultados_aprendizaje" TO "anon";
GRANT ALL ON TABLE "public"."resultados_aprendizaje" TO "authenticated";
GRANT ALL ON TABLE "public"."resultados_aprendizaje" TO "service_role";



GRANT ALL ON TABLE "public"."user_settings" TO "anon";
GRANT ALL ON TABLE "public"."user_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."user_settings" TO "service_role";



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
