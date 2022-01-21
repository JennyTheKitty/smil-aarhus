CREATE TABLE smil_aarhus.page(
    name text NOT NULL PRIMARY KEY
);

CREATE TABLE smil_aarhus.page_tr(
    page_name text NOT NULL REFERENCES smil_aarhus.page (name),
    language_code text NOT NULL REFERENCES smil_aarhus.tr_language (code),
    content text NOT NULL,
    PRIMARY KEY (page_name, language_code)
);

COMMENT ON TABLE smil_aarhus.page_tr IS E'@omit all,order,create,delete';

COMMENT ON CONSTRAINT page_tr_page_name_fkey ON smil_aarhus.page_tr IS E'@foreignFieldName translations';

GRANT SELECT ON TABLE smil_aarhus.page TO smil_anonymous, smil_organizer, smil_admin;
GRANT SELECT ON TABLE smil_aarhus.page_tr TO smil_anonymous, smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.page TO smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.page_tr TO smil_organizer, smil_admin;


CREATE SEQUENCE info_page_rank AS integer;

CREATE TABLE smil_aarhus.info_page(
    name text NOT NULL PRIMARY KEY REFERENCES smil_aarhus.page (name),
    icon text NOT NULL,
    rank integer NOT NULL DEFAULT nextval('info_page_rank')
);

ALTER SEQUENCE info_page_rank OWNED BY smil_aarhus.info_page.rank;

COMMENT ON TABLE smil_aarhus.info_page IS E'@omit create,update,delete,filter';

CREATE TABLE smil_aarhus.info_page_tr(
    info_page_name text NOT NULL REFERENCES smil_aarhus.info_page (name),
    language_code text NOT NULL REFERENCES smil_aarhus.tr_language (code),
    title text NOT NULL,
    subtitle text NOT NULL,
    PRIMARY KEY (info_page_name, language_code)
);

COMMENT ON TABLE smil_aarhus.info_page_tr IS E'@omit create,update,delete,all,order,filter';

COMMENT ON CONSTRAINT info_page_tr_info_page_name_fkey ON smil_aarhus.info_page_tr IS E'@foreignFieldName translations';

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
    info_page__name text
)
RETURNS smil_aarhus.info_page
AS $$
DECLARE
    info_page smil_aarhus.info_page;
    trans smil_aarhus.info_page_tr_data;
    lid bigint;
BEGIN
    UPDATE smil_aarhus.info_page
        SET icon = data.icon
        WHERE name = info_page__name
        RETURNING * INTO info_page;

    IF (info_page IS NULL) THEN
        INSERT INTO smil_aarhus.page(name)
            VALUES (info_page__name);
        INSERT INTO smil_aarhus.info_page(name, icon)
            VALUES (info_page__name, data.icon)
            RETURNING * INTO STRICT info_page;
    END IF;

    FOREACH trans IN ARRAY translations LOOP
        INSERT INTO smil_aarhus.info_page_tr (info_page_name, language_code, title, subtitle)
            VALUES (info_page__name, trans.language_code, trans.title, trans.subtitle)
            ON CONFLICT (info_page_name, language_code) DO UPDATE SET language_code = trans.language_code, title = trans.title, subtitle = trans.subtitle;
    END LOOP;
    DELETE FROM smil_aarhus.info_page_tr
        WHERE (info_page_name = info_page__name and language_code NOT IN (SELECT language_code FROM UNNEST(translations)));

    RETURN info_page;
END
$$ LANGUAGE plpgsql;


GRANT EXECUTE ON FUNCTION smil_aarhus.upsert_info_page TO smil_organizer, smil_admin;
