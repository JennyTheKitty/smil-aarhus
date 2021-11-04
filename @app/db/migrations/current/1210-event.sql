-- open to who?
-- price?
-- dress code?
-- text updated at?
CREATE TABLE smil_aarhus.event(
    id bigserial PRIMARY KEY,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    special boolean NOT NULL,
    category_id bigint REFERENCES smil_aarhus.event_category (id) NOT NULL
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
EXECUTE PROCEDURE smil_aarhus.tr_set_slug('event', 'id', 'event_id');
