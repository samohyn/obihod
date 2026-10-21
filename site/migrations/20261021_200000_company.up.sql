-- Глобал «Компания и контакты»: контакты, реквизиты, часы и цифры оффера (contex/10_offer.md).
CREATE TABLE "company" (
	"id" serial PRIMARY KEY NOT NULL,
	"phone_display" varchar DEFAULT '+7 (985) 170-51-11' NOT NULL,
	"phone_e164" varchar DEFAULT '+79851705111' NOT NULL,
	"email" varchar DEFAULT 'partner@obikhod.ru',
	"street_address" varchar DEFAULT 'ул. Амет-хан Султана, 15, к1',
	"address_locality" varchar DEFAULT 'Жуковский',
	"address_region" varchar DEFAULT 'Московская область',
	"postal_code" varchar DEFAULT '140185',
	"legal_name" varchar DEFAULT '',
	"tax_id" varchar,
	"kpp" varchar,
	"ogrn" varchar,
	"opens" varchar DEFAULT '08:00' NOT NULL,
	"closes" varchar DEFAULT '22:00' NOT NULL,
	"leads_all_day" boolean DEFAULT true,
	"night_callback_time" varchar DEFAULT '08:15' NOT NULL,
	"callback_minutes" numeric DEFAULT 10 NOT NULL,
	"callback_late_discount_rub" numeric DEFAULT 500 NOT NULL,
	"photo_estimate_minutes" numeric DEFAULT 30 NOT NULL,
	"emergency_hours" numeric DEFAULT 2 NOT NULL,
	"emergency_radius_km" numeric DEFAULT 30 NOT NULL,
	"free_visit_radius_km" numeric DEFAULT 50 NOT NULL,
	"arrival_window_hours" numeric DEFAULT 2 NOT NULL,
	"late_arrival_discount_percent" numeric DEFAULT 10 NOT NULL,
	"snow_reaction_hours" numeric DEFAULT 6 NOT NULL,
	"updated_at" timestamp(3) with time zone,
	"created_at" timestamp(3) with time zone
);

-- Ничего не теряется: контакты и реквизиты — как сейчас в «Шапке» (пустые — значения по умолчанию).
-- Часы — по офферу 8:00–22:00 (в разметке SEO стояло 21:00 и расходилось с сайтом).
INSERT INTO "company" (
	"phone_display", "phone_e164", "email", "street_address", "address_locality", "address_region",
	"postal_code", "legal_name", "tax_id", "kpp", "ogrn", "updated_at", "created_at"
)
SELECT
	coalesce(nullif("contacts_phone_display", ''), '+7 (985) 170-51-11'),
	coalesce(nullif("contacts_phone_e164", ''), '+79851705111'),
	coalesce(nullif("contacts_email", ''), 'partner@obikhod.ru'),
	coalesce(nullif("requisites_street_address", ''), 'ул. Амет-хан Султана, 15, к1'),
	coalesce(nullif("requisites_address_locality", ''), 'Жуковский'),
	coalesce(nullif("requisites_address_region", ''), 'Московская область'),
	coalesce(nullif("requisites_postal_code", ''), '140185'),
	coalesce("requisites_legal_name", ''),
	"requisites_tax_id",
	"requisites_kpp",
	"requisites_ogrn",
	now(),
	now()
FROM "site_chrome"
ORDER BY "id"
LIMIT 1;
