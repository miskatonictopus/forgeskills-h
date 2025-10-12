DO $$
DECLARE
  asig_id_text text;
BEGIN
  -- 1) Localiza la asignatura por código (guardamos el id como TEXT)
  SELECT id::text INTO asig_id_text
  FROM public.asignaturas
  WHERE codigo = '1665';

  IF asig_id_text IS NULL THEN
    RAISE NOTICE 'No existe asignatura con codigo=1665';
    RETURN;
  END IF;

  -- 2) Borra dependencias (cast a TEXT en todas las comparaciones)
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema='public' AND table_name='criterios_evaluacion') THEN
    DELETE FROM public.criterios_evaluacion
    WHERE ra_id::text IN (
      SELECT id::text
      FROM public.resultados_aprendizaje
      WHERE asignatura_id::text = asig_id_text
    );
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema='public' AND table_name='resultados_aprendizaje') THEN
    DELETE FROM public.resultados_aprendizaje
    WHERE asignatura_id::text = asig_id_text;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema='public' AND table_name='curso_asignaturas') THEN
    DELETE FROM public.curso_asignaturas
    WHERE asignatura_id::text = asig_id_text;
  END IF;

  -- 3) Borra la propia asignatura
  DELETE FROM public.asignaturas
  WHERE id::text = asig_id_text;

  RAISE NOTICE 'Asignatura 1665 borrada correctamente.';
END $$;


DELETE FROM public.criterios_evaluacion
WHERE ra_id::text IN (
  SELECT id::text FROM public.resultados_aprendizaje
  WHERE asignatura_id::text = '1665'
);

-- 2) RA de la asignatura
DELETE FROM public.resultados_aprendizaje
WHERE asignatura_id::text = '1665';

-- 3) Relaciones curso↔asignatura (si existen)
DELETE FROM public.curso_asignaturas
WHERE asignatura_id::text = '1665';

-- 4) La asignatura
DELETE FROM public.asignaturas
WHERE id::text = '1665';