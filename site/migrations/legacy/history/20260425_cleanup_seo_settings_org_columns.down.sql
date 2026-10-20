-- Rollback for unused columns cleanup. Restores schema, not data — the dropped
-- columns and seo_settings_same_as table were empty on prod at cleanup time.
-- Types and nullability mirror the original prod schema produced by db.push
-- before ADR-0002 (US-2) introduced the SiteChrome / persons split.

BEGIN;

-- 1. Recreate seo_settings_same_as child table.
CREATE TABLE IF NOT EXISTS public.seo_settings_same_as (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    url character varying,
    CONSTRAINT seo_settings_same_as_pkey PRIMARY KEY (id),
    CONSTRAINT seo_settings_same_as_parent_id_fk FOREIGN KEY (_parent_id)
        REFERENCES public.seo_settings(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS seo_settings_same_as_order_idx
    ON public.seo_settings_same_as (_order);
CREATE INDEX IF NOT EXISTS seo_settings_same_as_parent_id_idx
    ON public.seo_settings_same_as (_parent_id);

-- 2. Recreate 9 organization_* columns as nullable with no defaults.
ALTER TABLE public.seo_settings
    ADD COLUMN IF NOT EXISTS organization_legal_name character varying,
    ADD COLUMN IF NOT EXISTS organization_tax_id character varying,
    ADD COLUMN IF NOT EXISTS organization_ogrn character varying,
    ADD COLUMN IF NOT EXISTS organization_address_region character varying,
    ADD COLUMN IF NOT EXISTS organization_address_locality character varying,
    ADD COLUMN IF NOT EXISTS organization_street_address character varying,
    ADD COLUMN IF NOT EXISTS organization_postal_code character varying,
    ADD COLUMN IF NOT EXISTS organization_telephone character varying,
    ADD COLUMN IF NOT EXISTS organization_founding_date timestamp(3) with time zone;

COMMIT;
