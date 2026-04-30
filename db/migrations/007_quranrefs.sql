-- Table: public.quranrefs

-- DROP TABLE IF EXISTS public.quranrefs;

CREATE TABLE IF NOT EXISTS public.quranrefs
(
    name_id integer NOT NULL,
    transliteration text COLLATE pg_catalog."default" NOT NULL,
    qref text COLLATE pg_catalog."default",
    details text COLLATE pg_catalog."default",
    CONSTRAINT quranrefs_pkey PRIMARY KEY (name_id),
    CONSTRAINT quranrefs_name_id_fkey FOREIGN KEY (name_id)
        REFERENCES public.names (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.quranrefs
    OWNER to avnadmin;