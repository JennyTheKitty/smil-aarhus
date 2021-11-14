-- open to who?
-- price?
-- dress code?
-- text updated at?
CREATE TABLE smil_aarhus.event(
    id bigserial PRIMARY KEY,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    special boolean NOT NULL,
    override_image_file TEXT
);

CREATE TABLE smil_aarhus.event_tr(
    event_id bigint REFERENCES smil_aarhus.event (id),
    language_code text REFERENCES smil_aarhus.tr_language (code),
    title text NOT NULL,
    description text NOT NULL,
    venue text NOT NULL,
    slug text NOT NULL,
    PRIMARY KEY (event_id, language_code)
);

COMMENT ON CONSTRAINT event_tr_event_id_fkey ON smil_aarhus.event_tr IS E'@foreignFieldName translations';

GRANT SELECT ON TABLE smil_aarhus.event TO smil_anonymous, smil_organizer, smil_admin;
GRANT SELECT ON TABLE smil_aarhus.event_tr TO smil_anonymous, smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.event TO smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.event_tr TO smil_organizer, smil_admin;

CREATE TRIGGER add_event_tr_slug BEFORE INSERT ON smil_aarhus.event_tr FOR EACH ROW
WHEN (NEW.title IS NOT NULL AND NEW.slug IS NULL)
EXECUTE PROCEDURE smil_aarhus.tr_set_slug('event', 'id', 'event_id', 'true');

create OR REPLACE function smil_aarhus.event_image_file(e smil_aarhus.event)
returns TEXT
as $$
DECLARE
    _l record;
BEGIN
    -- Return override
    IF (e.override_image_file IS NOT NULL) THEN
        RETURN e.override_image_file;
    END IF;

    -- Get first group
    select smil_aarhus.group.image_file from smil_aarhus.event_via_group INNER JOIN smil_aarhus.group ON smil_aarhus.event_via_group.group_id = smil_aarhus.group.id WHERE smil_aarhus.event_via_group.event_id = e.id LIMIT 1 INTO _l;
    if (_l.image_file IS NOT NULL) THEN
        RETURN _l.image_file;
    END IF;

    -- Otherwise try tag
    select smil_aarhus.event_tag.image_file from smil_aarhus.event_via_event_tag INNER JOIN smil_aarhus.event_tag ON smil_aarhus.event_via_event_tag.tag_id = smil_aarhus.event_tag.id LIMIT 1 INTO _l;
    if (_l.image_file IS NOT NULL) THEN
        RETURN _l.image_file;
    END IF;

    -- Otherwise null
    return null;

END
$$ language plpgsql STABLE;
