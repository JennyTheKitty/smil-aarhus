-- open to who?
-- price?
-- dress code?
-- text updated at?
CREATE TABLE smil_aarhus.event(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    special boolean NOT NULL,
    override_image uuid REFERENCES smil_aarhus.image(id),
    template_name text
);

COMMENT ON TABLE smil_aarhus.event IS E'@omit create,update,delete';

CREATE TABLE smil_aarhus.event_tr(
    event_id uuid REFERENCES smil_aarhus.event (id),
    language_code text REFERENCES smil_aarhus.tr_language (code),
    title text NOT NULL,
    description text NOT NULL,
    slug text NOT NULL,
    PRIMARY KEY (event_id, language_code),
    UNIQUE (slug, language_code)
);

COMMENT ON TABLE smil_aarhus.event_tr IS E'@omit create,update,delete,all,order';

COMMENT ON CONSTRAINT event_tr_event_id_fkey ON smil_aarhus.event_tr IS E'@foreignFieldName translations';

GRANT SELECT ON TABLE smil_aarhus.event TO smil_anonymous, smil_organizer, smil_admin;
GRANT SELECT ON TABLE smil_aarhus.event_tr TO smil_anonymous, smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.event TO smil_anonymous, smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.event_tr TO smil_anonymous, smil_organizer, smil_admin;

CREATE TRIGGER add_event_tr_slug BEFORE INSERT ON smil_aarhus.event_tr FOR EACH ROW
WHEN (NEW.title IS NOT NULL AND NEW.slug IS NULL)
EXECUTE PROCEDURE smil_aarhus.tr_set_slug('event', 'id', 'event_id', TRUE);

CREATE OR REPLACE FUNCTION smil_aarhus.event_by_slug(slug text, preferred_language_code TEXT)
RETURNS smil_aarhus.event
AS $$
DECLARE
    tr record;
    event smil_aarhus.event;
    _slug alias FOR slug;
BEGIN
    SELECT INTO tr event_id from smil_aarhus.event_tr where (smil_aarhus.event_tr.slug = _slug and smil_aarhus.event_tr.language_code = preferred_language_code);
    IF (tr IS NULL) THEN
        SELECT INTO tr event_id from smil_aarhus.event_tr where (smil_aarhus.event_tr.slug = _slug) LIMIT 1;
    END IF;
    SELECT INTO event * from smil_aarhus.event where (smil_aarhus.event.id = tr.event_id);
    RETURN event;
END
$$ LANGUAGE plpgsql STABLE;

CREATE INDEX event_template_name_trgm_index on smil_aarhus.event using gin(template_name gin_trgm_ops);

CREATE OR REPLACE FUNCTION smil_aarhus.search_event_templates(query text)
returns setof smil_aarhus.event
as $$
BEGIN
    IF (query = '') THEN
        RETURN QUERY SELECT smil_aarhus.event.*
        FROM
            smil_aarhus.event
        WHERE smil_aarhus.event.template_name is NOT NULL;
    ELSE
        RETURN QUERY SELECT
            id, starts_at, ends_at, special, override_image, template_name
        FROM
            (SELECT DISTINCT
                smil_aarhus.event.*,
                similarity (smil_aarhus.event.template_name, query) AS X
            FROM
                smil_aarhus.event
            WHERE
                similarity (smil_aarhus.event.template_name, query) > 0.05
            ) AS g
        ORDER BY
            X;
    END IF;
END
$$ language plpgsql stable;

CREATE OR REPLACE FUNCTION smil_aarhus.event_image(eid uuid, override_image uuid)
RETURNS uuid
AS $$
DECLARE
    _l record;
BEGIN
    -- Return override
    IF (override_image IS NOT NULL) THEN
        return override_image;
    END IF;

    -- Get first group
    select smil_aarhus.group.image from smil_aarhus.event_via_group INNER JOIN smil_aarhus.group ON smil_aarhus.event_via_group.group_id = smil_aarhus.group.id WHERE smil_aarhus.event_via_group.event_id = eid LIMIT 1 INTO _l;
    if (_l.image IS NOT NULL) THEN
        return _l.image;
    END IF;

    -- Otherwise try tag
    select smil_aarhus.event_tag.image from smil_aarhus.event_via_event_tag INNER JOIN smil_aarhus.event_tag ON smil_aarhus.event_via_event_tag.tag_id = smil_aarhus.event_tag.id WHERE smil_aarhus.event_via_event_tag.event_id = eid LIMIT 1 INTO _l;
    if (_l.image IS NOT NULL) THEN
        return _l.image;
    END IF;

    -- Otherwise null
    return null;

END
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION smil_aarhus.event_image IS E'@omit all,execute';

CREATE OR REPLACE FUNCTION smil_aarhus.event_color(event event)
RETURNS text
AS $$
DECLARE
    _l record;
BEGIN
    -- Get first group
    select smil_aarhus.group.color from smil_aarhus.event_via_group INNER JOIN smil_aarhus.group ON smil_aarhus.event_via_group.group_id = smil_aarhus.group.id WHERE smil_aarhus.event_via_group.event_id = event.id LIMIT 1 INTO _l;
    if (_l.color IS NOT NULL) THEN
        return _l.color;
    END IF;

    -- Otherwise try tag
    select smil_aarhus.event_tag.color from smil_aarhus.event_via_event_tag INNER JOIN smil_aarhus.event_tag ON smil_aarhus.event_via_event_tag.tag_id = smil_aarhus.event_tag.id WHERE smil_aarhus.event_via_event_tag.event_id = event.id LIMIT 1 INTO _l;
    if (_l.color IS NOT NULL) THEN
        return _l.color;
    END IF;

    -- Otherwise default color
    return '#3788d8';

END
$$ LANGUAGE plpgsql STABLE;


CREATE TYPE smil_aarhus.event_data AS (
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    special boolean,
    override_image uuid,
    template_name text,
    tag_ids uuid[],
    group_ids uuid[]
);

COMMENT ON COLUMN smil_aarhus.event_data.starts_at IS E'@notNull';
COMMENT ON COLUMN smil_aarhus.event_data.ends_at IS E'@notNull';
COMMENT ON COLUMN smil_aarhus.event_data.special IS E'@notNull';

CREATE TYPE smil_aarhus.event_tr_data AS (
    language_code text,
    title text,
    description text
);

COMMENT ON COLUMN smil_aarhus.event_tr_data.language_code IS E'@notNull';
COMMENT ON COLUMN smil_aarhus.event_tr_data.title IS E'@notNull';
COMMENT ON COLUMN smil_aarhus.event_tr_data.description IS E'@notNull';

CREATE OR REPLACE FUNCTION smil_aarhus.upsert_event(
    data smil_aarhus.event_data,
    translations smil_aarhus.event_tr_data[],
    event__id uuid DEFAULT NULL
)
RETURNS smil_aarhus.event
AS $$
DECLARE
    event smil_aarhus.event;
    trans smil_aarhus.event_tr_data;
    lid uuid;
BEGIN
    IF (event__id IS NULL) THEN
        INSERT INTO smil_aarhus.event(starts_at, ends_at, special, override_image, template_name)
            VALUES (data.starts_at, data.ends_at, data.special, data.override_image, data.template_name)
            RETURNING * INTO STRICT event;
    ELSE
        UPDATE smil_aarhus.event
            SET starts_at = data.starts_at, ends_at = data.ends_at, special = data.special, override_image = data.override_image, template_name = data.template_name
            WHERE id = event__id
            RETURNING * INTO STRICT event;
    END IF;

    FOREACH trans IN ARRAY translations LOOP
        INSERT INTO smil_aarhus.event_tr (event_id, language_code, title, description)
            VALUES (event.id, trans.language_code, trans.title, trans.description)
            ON CONFLICT (event_id, language_code) DO UPDATE SET language_code = trans.language_code, title = trans.title, description = trans.description;
    END LOOP;
    DELETE FROM smil_aarhus.event_tr
        WHERE (event_id = event.id and language_code NOT IN (SELECT language_code FROM UNNEST(translations)));

    FOREACH lid IN ARRAY COALESCE(data.tag_ids, ARRAY[]::uuid[]) LOOP
        INSERT INTO smil_aarhus.event_via_event_tag (event_id, tag_id)
        VALUES (event.id, lid)
        ON CONFLICT (event_id, tag_id) DO NOTHING;
    END LOOP;
    DELETE FROM smil_aarhus.event_via_event_tag
        WHERE (event_id = event.id and tag_id <> ALL(data.tag_ids));

    FOREACH lid IN ARRAY COALESCE(data.group_ids, ARRAY[]::uuid[]) LOOP
        INSERT INTO smil_aarhus.event_via_group (event_id, group_id)
        VALUES (event.id, lid)
        ON CONFLICT (event_id, group_id) DO NOTHING;
    END LOOP;
    DELETE FROM smil_aarhus.event_via_group
        WHERE (event_id = event.id and group_id <> ALL(data.group_ids));

    RETURN event;
END
$$ LANGUAGE plpgsql;


GRANT EXECUTE ON FUNCTION smil_aarhus.upsert_event TO smil_organizer, smil_admin;
