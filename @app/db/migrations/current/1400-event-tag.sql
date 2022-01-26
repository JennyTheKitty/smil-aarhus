CREATE TABLE smil_aarhus.event_tag(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    image uuid REFERENCES smil_aarhus.image(id)
);


COMMENT ON TABLE smil_aarhus.event_tag IS E'@omit create,update,delete\n@simpleCollections both';

CREATE TABLE smil_aarhus.event_tag_tr(
    tag_id uuid constraint event_tag_tr_tag_id_fkey REFERENCES smil_aarhus.event_tag(id),
    language_code text constraint event_tag_tr_language_code_fkey REFERENCES smil_aarhus.tr_language(code),
    title text NOT NULL,
    PRIMARY KEY (tag_id, language_code)
);


COMMENT ON TABLE smil_aarhus.event_tag_tr IS E'@omit create,update,delete,all,order';

COMMENT ON CONSTRAINT event_tag_tr_tag_id_fkey ON smil_aarhus.event_tag_tr IS E'@foreignFieldName translations';

GRANT SELECT ON TABLE smil_aarhus.event_tag TO smil_anonymous, smil_organizer, smil_admin;
GRANT SELECT ON TABLE smil_aarhus.event_tag_tr TO smil_anonymous, smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.event_tag TO smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.event_tag_tr TO smil_organizer, smil_admin;

CREATE INDEX event_tag_tr_title_trgm_index on smil_aarhus.event_tag_tr using gin(title gin_trgm_ops);

CREATE OR REPLACE FUNCTION smil_aarhus.search_event_tags(query text)
returns setof smil_aarhus.event_tag
as $$
BEGIN
    IF (query = '') THEN
        RETURN QUERY SELECT DISTINCT smil_aarhus.event_tag.*
        FROM
        smil_aarhus.event_tag_tr
        inner join smil_aarhus.event_tag ON smil_aarhus.event_tag_tr.tag_id = smil_aarhus.event_tag.id;
    ELSE
        RETURN QUERY SELECT
            id, image
        FROM
            (SELECT DISTINCT
                smil_aarhus.event_tag.*,
                similarity (smil_aarhus.event_tag_tr.title, query) AS X
            FROM
                smil_aarhus.event_tag_tr
                INNER JOIN smil_aarhus.event_tag ON smil_aarhus.event_tag_tr.tag_id = smil_aarhus.event_tag.id
            WHERE
                similarity (smil_aarhus.event_tag_tr.title, query) > 0.05
            ) AS g
        ORDER BY
            X;
    END IF;
END
$$ language plpgsql stable;


create table smil_aarhus.event_via_event_tag (
  event_id uuid constraint event_via_event_tag_event_id_fkey references smil_aarhus.event (id),
  tag_id uuid constraint event_via_event_tag_tag_id_fkey references smil_aarhus.event_tag (id),
  primary key (event_id, tag_id)
);

comment on table smil_aarhus.event_via_event_tag is E'@omit all,create,delete,update,order,filter';

comment on constraint event_via_event_tag_tag_id_fkey on smil_aarhus.event_via_event_tag is E'@foreignFieldName events\n@manyToManyFieldName events';
comment on constraint event_via_event_tag_event_id_fkey on smil_aarhus.event_via_event_tag is E'@foreignFieldName tags\n@manyToManyFieldName tags';

GRANT SELECT ON TABLE smil_aarhus.event_via_event_tag TO smil_anonymous, smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.event_via_event_tag TO smil_organizer, smil_admin;

CREATE TYPE smil_aarhus.event_tag_data AS (
    image uuid,
    image_credit text
);

CREATE TYPE smil_aarhus.event_tag_tr_data AS (
    language_code text,
    title text
);

COMMENT ON COLUMN smil_aarhus.event_tag_tr_data.language_code IS E'@notNull';
COMMENT ON COLUMN smil_aarhus.event_tag_tr_data.title IS E'@notNull';

CREATE OR REPLACE FUNCTION smil_aarhus.upsert_event_tag(
    data smil_aarhus.event_tag_data,
    translations smil_aarhus.event_tag_tr_data[],
    event_tag__id uuid DEFAULT NULL
)
RETURNS smil_aarhus.event_tag
AS $$
DECLARE
    _event_tag smil_aarhus.event_tag;
    trans smil_aarhus.event_tag_tr_data;
BEGIN
    IF (event_tag__id IS NULL) THEN
        INSERT INTO smil_aarhus.event_tag(image)
            VALUES (data.image)
            RETURNING * INTO STRICT _event_tag;
    ELSE
        UPDATE smil_aarhus.event_tag
            SET image = data.image
            WHERE id = event_tag__id
            RETURNING * INTO STRICT _event_tag;
    END IF;

    UPDATE smil_aarhus.image SET credit = data.image_credit where id = data.image;

    FOREACH trans IN ARRAY translations LOOP
        INSERT INTO smil_aarhus.event_tag_tr (tag_id, language_code, title)
            VALUES (_event_tag.id, trans.language_code, trans.title)
            ON CONFLICT (tag_id, language_code) DO UPDATE SET language_code = trans.language_code, title = trans.title;
    END LOOP;
    DELETE FROM smil_aarhus.event_tag_tr
        WHERE (tag_id = _event_tag.id and language_code NOT IN (SELECT language_code FROM UNNEST(translations)));

    RETURN _event_tag;
END
$$ LANGUAGE plpgsql;


GRANT EXECUTE ON FUNCTION smil_aarhus.upsert_event_tag TO smil_organizer, smil_admin;

