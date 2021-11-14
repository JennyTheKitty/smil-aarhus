CREATE TABLE smil_aarhus.event_template(
    id bigserial PRIMARY KEY
);

CREATE TABLE smil_aarhus.event_template_tr(
    event_template_id bigint REFERENCES smil_aarhus.event_template (id),
    language_code text REFERENCES smil_aarhus.tr_language (code),
    title text NOT NULL,
    description text NOT NULL,
    venue text NOT NULL,
    PRIMARY KEY (event_template_id, language_code)
);

COMMENT ON CONSTRAINT event_template_tr_event_template_id_fkey ON smil_aarhus.event_template_tr IS E'@foreignFieldName translations'; -- noqa: L016

GRANT SELECT ON TABLE smil_aarhus.event_template TO smil_anonymous, smil_organizer, smil_admin;
GRANT SELECT ON TABLE smil_aarhus.event_template_tr TO smil_anonymous, smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.event_template TO smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.event_template_tr TO smil_organizer, smil_admin;
