-- Тип ориентира района «Населённый пункт» (np) — план 09, этап 6. Expand: новое значение перечисления.
ALTER TYPE "public"."enum__districts_v_version_landmarks_type" ADD VALUE IF NOT EXISTS 'np' BEFORE 'snt';
ALTER TYPE "public"."enum_districts_landmarks_type" ADD VALUE IF NOT EXISTS 'np' BEFORE 'snt';
