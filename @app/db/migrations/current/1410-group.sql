CREATE TABLE smil_aarhus.group(
    id bigserial PRIMARY KEY,
    image bigint REFERENCES smil_aarhus.image(id),
    is_open boolean NOT NULL
);


COMMENT ON TABLE smil_aarhus.group IS E'@omit create,update,delete';

CREATE TABLE smil_aarhus.group_tr(
    group_id bigint REFERENCES smil_aarhus.group (id),
    language_code text REFERENCES smil_aarhus.tr_language (code),
    title text NOT NULL,
    short_description text NOT NULL,
    description text NOT NULL,
    activity text not null,
    slug text NOT NULL,
    PRIMARY KEY (group_id, language_code),
    UNIQUE (slug, language_code)
);

CREATE OR REPLACE FUNCTION smil_aarhus.group_by_slug(slug text, preferred_language_code TEXT)
RETURNS smil_aarhus.group
AS $$
DECLARE
    tr record;
    group smil_aarhus.group;
    _slug alias FOR slug;
BEGIN
    SELECT INTO tr group_id from smil_aarhus.group_tr where (smil_aarhus.group_tr.slug = _slug and smil_aarhus.group_tr.language_code = preferred_language_code);
    IF (tr IS NULL) THEN
        SELECT INTO tr group_id from smil_aarhus.group_tr where (smil_aarhus.group_tr.slug = _slug) LIMIT 1;
    END IF;
    SELECT INTO group * from smil_aarhus.group where (smil_aarhus.group.id = tr.group_id);
    RETURN group;
END
$$ LANGUAGE plpgsql STABLE;


COMMENT ON TABLE smil_aarhus.group_tr IS E'@omit create,update,delete,all,order';

COMMENT ON CONSTRAINT group_tr_group_id_fkey ON smil_aarhus.group_tr IS E'@foreignFieldName translations';

GRANT SELECT ON TABLE smil_aarhus.group TO smil_anonymous, smil_organizer, smil_admin;
GRANT SELECT ON TABLE smil_aarhus.group_tr TO smil_anonymous, smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.group TO smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.group_tr TO smil_organizer, smil_admin;

CREATE TRIGGER add_group_tr_slug BEFORE INSERT ON smil_aarhus.group_tr FOR EACH ROW
WHEN (NEW.title IS NOT NULL AND NEW.slug IS NULL)
EXECUTE PROCEDURE smil_aarhus.tr_set_slug('group', 'id', 'group_id', 'false');

CREATE INDEX group_tr_title_trgm_index on smil_aarhus.group_tr using gin(title gin_trgm_ops);

CREATE OR REPLACE FUNCTION smil_aarhus.search_groups(query text)
returns setof smil_aarhus.group
as $$
BEGIN
    IF (query = '') THEN
        RETURN QUERY SELECT DISTINCT smil_aarhus.group.*
        FROM
        smil_aarhus.group_tr
        inner join smil_aarhus.group ON smil_aarhus.group_tr.group_id = smil_aarhus.group.id;
    ELSE
        RETURN QUERY SELECT
            id, image, is_open
        FROM
            (SELECT DISTINCT
                smil_aarhus.GROUP.*,
                similarity (smil_aarhus.group_tr.title, query) AS X
            FROM
                smil_aarhus.group_tr
                INNER JOIN smil_aarhus.group ON smil_aarhus.group_tr.group_id = smil_aarhus.group.id
            WHERE
                similarity (smil_aarhus.group_tr.title, query) > 0.05
            ) AS g
        ORDER BY
            X;
    END IF;
END
$$ language plpgsql stable;

create table smil_aarhus.event_via_group (
  event_id bigint constraint event_via_group_event_id_fkey references smil_aarhus.event (id),
  group_id bigint constraint event_via_group_group_id_fkey references smil_aarhus.group (id),
  primary key (event_id, group_id)
);

comment on table smil_aarhus.event_via_group is E'@omit all,create,delete,update,order';


comment on constraint event_via_group_event_id_fkey on smil_aarhus.event_via_group is E'@foreignFieldName groups\n@manyToManyFieldName groups';
comment on constraint event_via_group_group_id_fkey on smil_aarhus.event_via_group is E'@foreignFieldName events\n@manyToManyFieldName events';

GRANT SELECT ON TABLE smil_aarhus.event_via_group TO smil_anonymous, smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.event_via_group TO smil_organizer, smil_admin;

CREATE TYPE smil_aarhus.group_data AS (
    image bigint,
    image_credit text,
    is_open boolean
);

COMMENT ON COLUMN smil_aarhus.group_data.image IS E'@notNull';
COMMENT ON COLUMN smil_aarhus.group_data.image_credit IS E'@notNull';
COMMENT ON COLUMN smil_aarhus.group_data.is_open IS E'@notNull';

CREATE TYPE smil_aarhus.group_tr_data AS (
    language_code text,
    title text,
    short_description text,
    description text,
    activity text
);

COMMENT ON COLUMN smil_aarhus.group_tr_data.language_code IS E'@notNull';
COMMENT ON COLUMN smil_aarhus.group_tr_data.title IS E'@notNull';
COMMENT ON COLUMN smil_aarhus.group_tr_data.description IS E'@notNull';
COMMENT ON COLUMN smil_aarhus.group_tr_data.short_description IS E'@notNull';
COMMENT ON COLUMN smil_aarhus.group_tr_data.activity IS E'@notNull';

CREATE OR REPLACE FUNCTION smil_aarhus.upsert_group(
    data smil_aarhus.group_data,
    translations smil_aarhus.group_tr_data[],
    group__id bigint DEFAULT NULL
)
RETURNS smil_aarhus.group
AS $$
DECLARE
    _group smil_aarhus.group;
    trans smil_aarhus.group_tr_data;
BEGIN
    IF (group__id IS NULL) THEN
        INSERT INTO smil_aarhus.group(image, is_open)
            VALUES (data.image, data.is_open)
            RETURNING * INTO STRICT _group;
    ELSE
        UPDATE smil_aarhus.group
            SET image = data.image, is_open = data.is_open
            WHERE id = group__id
            RETURNING * INTO STRICT _group;
    END IF;

    UPDATE smil_aarhus.image SET credit = data.image_credit where id = data.image;

    FOREACH trans IN ARRAY translations LOOP
        INSERT INTO smil_aarhus.group_tr (group_id, language_code, title, short_description, description, activity)
            VALUES (_group.id, trans.language_code, trans.title, trans.short_description, trans.description, trans.activity)
            ON CONFLICT (group_id, language_code) DO UPDATE SET language_code = trans.language_code, title = trans.title, short_description = trans.short_description, description = trans.description, activity = trans.activity;
    END LOOP;
    DELETE FROM smil_aarhus.group_tr
        WHERE (group_id = _group.id and language_code NOT IN (SELECT language_code FROM UNNEST(translations)));

    RETURN _group;
END
$$ LANGUAGE plpgsql;


GRANT EXECUTE ON FUNCTION smil_aarhus.upsert_group TO smil_anonymous, smil_organizer, smil_admin;

CREATE OR REPLACE FUNCTION smil_aarhus.events_by_group(group_id bigint)
returns setof smil_aarhus.event
as $$
DECLARE
   gid bigint;
BEGIN
    gid := group_id;
    RETURN QUERY SELECT smil_aarhus.event.*
    FROM
        smil_aarhus.event_via_group
        INNER JOIN smil_aarhus.event ON smil_aarhus.event.id = smil_aarhus.event_via_group.event_id
    WHERE smil_aarhus.event.template_name is NULL AND smil_aarhus.event_via_group.group_id = gid
    ORDER BY smil_aarhus.event.starts_at ASC
    LIMIT 5;
END
$$ language plpgsql stable;


GRANT EXECUTE ON FUNCTION smil_aarhus.upsert_event TO smil_anonymous, smil_organizer, smil_admin;
