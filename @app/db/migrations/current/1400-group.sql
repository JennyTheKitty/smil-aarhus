CREATE TABLE smil_aarhus.group(
    id bigserial PRIMARY KEY,
    image_file text
);

CREATE TABLE smil_aarhus.group_tr(
    group_id bigint REFERENCES smil_aarhus.group (id),
    language_code text REFERENCES smil_aarhus.tr_language (code),
    title text NOT NULL,
    description text NOT NULL,
    slug text NOT NULL,
    PRIMARY KEY (group_id, language_code)
);

COMMENT ON CONSTRAINT group_tr_group_id_fkey ON smil_aarhus.group_tr IS E'@foreignFieldName translations';

GRANT SELECT ON TABLE smil_aarhus.group TO smil_anonymous, smil_organizer, smil_admin;
GRANT SELECT ON TABLE smil_aarhus.group_tr TO smil_anonymous, smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.group TO smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.group_tr TO smil_organizer, smil_admin;

CREATE TRIGGER add_group_tr_slug BEFORE INSERT ON smil_aarhus.group_tr FOR EACH ROW
WHEN (NEW.title IS NOT NULL AND NEW.slug IS NULL)
EXECUTE PROCEDURE smil_aarhus.tr_set_slug('group', 'id', 'group_id', 'false');
