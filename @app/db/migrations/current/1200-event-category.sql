CREATE TABLE smil_aarhus.event_category(
    id bigserial PRIMARY KEY
);

CREATE TABLE smil_aarhus.event_category_tr(
    category_id bigint REFERENCES smil_aarhus.event_category(id),
    language_code text REFERENCES smil_aarhus.tr_language(code),
    title text NOT NULL,
    PRIMARY KEY (category_id, language_code)
);

COMMENT ON CONSTRAINT event_category_tr_category_id_fkey ON smil_aarhus.event_category_tr IS E'@foreignFieldName translations';

GRANT SELECT ON TABLE smil_aarhus.event_category TO smil_anonymous, smil_organizer, smil_admin;
GRANT SELECT ON TABLE smil_aarhus.event_category_tr TO smil_anonymous, smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.event_category TO smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.event_category_tr TO smil_organizer, smil_admin;
