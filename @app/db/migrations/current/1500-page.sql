CREATE TABLE smil_aarhus.page(
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()
);

CREATE TABLE smil_aarhus.page_tr(
    page_id uuid NOT NULL REFERENCES smil_aarhus.page (id),
    language_code text NOT NULL REFERENCES smil_aarhus.tr_language (code),
    content text NOT NULL,
    PRIMARY KEY (page_id, language_code)
);

COMMENT ON TABLE smil_aarhus.page_tr IS E'@omit all,order,create,delete';

COMMENT ON CONSTRAINT page_tr_page_id_fkey ON smil_aarhus.page_tr IS E'@foreignFieldName translations';

GRANT SELECT ON TABLE smil_aarhus.page TO smil_anonymous, smil_organizer, smil_admin;
GRANT SELECT ON TABLE smil_aarhus.page_tr TO smil_anonymous, smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.page TO smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.page_tr TO smil_organizer, smil_admin;


CREATE SEQUENCE info_page_rank AS integer;

CREATE TABLE smil_aarhus.info_page(
    id uuid NOT NULL PRIMARY KEY REFERENCES smil_aarhus.page (id),
    icon text NOT NULL,
    rank integer NOT NULL DEFAULT nextval('info_page_rank')
);

ALTER SEQUENCE info_page_rank OWNED BY smil_aarhus.info_page.rank;

COMMENT ON TABLE smil_aarhus.info_page IS E'@omit create,update,delete,filter';

CREATE TABLE smil_aarhus.info_page_tr(
    info_page_id uuid NOT NULL REFERENCES smil_aarhus.info_page (id),
    language_code text NOT NULL REFERENCES smil_aarhus.tr_language (code),
    title text NOT NULL,
    subtitle text NOT NULL,
    PRIMARY KEY (info_page_id, language_code)
);

COMMENT ON TABLE smil_aarhus.info_page_tr IS E'@omit create,update,delete,all,order,filter';

COMMENT ON CONSTRAINT info_page_tr_info_page_id_fkey ON smil_aarhus.info_page_tr IS E'@foreignFieldName translations';

CREATE FUNCTION smil_aarhus.info_page_tr_slug(info_page_tr info_page_tr) RETURNS text AS $$
  SELECT smil_aarhus.slugify(info_page_tr.title)
$$ LANGUAGE sql STABLE;

GRANT SELECT ON TABLE smil_aarhus.info_page TO smil_anonymous, smil_organizer, smil_admin;
GRANT SELECT ON TABLE smil_aarhus.info_page_tr TO smil_anonymous, smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.info_page TO smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.info_page_tr TO smil_organizer, smil_admin;

CREATE TYPE smil_aarhus.info_page_data AS (
    icon text
);

COMMENT ON COLUMN smil_aarhus.info_page_data.icon IS E'@notNull';

CREATE TYPE smil_aarhus.info_page_tr_data AS (
    language_code text,
    title text,
    subtitle text
);

COMMENT ON COLUMN smil_aarhus.info_page_tr_data.language_code IS E'@notNull';
COMMENT ON COLUMN smil_aarhus.info_page_tr_data.title IS E'@notNull';
COMMENT ON COLUMN smil_aarhus.info_page_tr_data.subtitle IS E'@notNull';

CREATE OR REPLACE FUNCTION smil_aarhus.upsert_info_page(
    data smil_aarhus.info_page_data,
    translations smil_aarhus.info_page_tr_data[],
    info_page__id uuid DEFAULT NULL
)
RETURNS smil_aarhus.info_page
AS $$
DECLARE
    page smil_aarhus.page;
    info_page smil_aarhus.info_page;
    trans smil_aarhus.info_page_tr_data;
    lid uuid;
BEGIN
    IF (info_page__id IS NOT NULL) THEN
        UPDATE smil_aarhus.info_page
            SET icon = data.icon
            WHERE id = info_page__id
            RETURNING * INTO STRICT info_page;
    ELSE
        INSERT INTO smil_aarhus.page(id)
            VALUES (default)
            RETURNING * INTO STRICT page;
        INSERT INTO smil_aarhus.info_page(id, icon)
            VALUES (page.id, data.icon)
            RETURNING * INTO STRICT info_page;
    END IF;

    FOREACH trans IN ARRAY translations LOOP
        INSERT INTO smil_aarhus.info_page_tr (info_page_id, language_code, title, subtitle)
            VALUES (info_page.id, trans.language_code, trans.title, trans.subtitle)
            ON CONFLICT (info_page_id, language_code) DO UPDATE SET language_code = trans.language_code, title = trans.title, subtitle = trans.subtitle;
    END LOOP;
    DELETE FROM smil_aarhus.info_page_tr
        WHERE (info_page_id = info_page.id and language_code NOT IN (SELECT language_code FROM UNNEST(translations)));

    RETURN info_page;
END
$$ LANGUAGE plpgsql;


GRANT EXECUTE ON FUNCTION smil_aarhus.upsert_info_page TO smil_organizer, smil_admin;
