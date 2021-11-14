CREATE VIEW smil_aarhus_admin.event_template AS
SELECT
    smil_aarhus.event_template.id,
    hstore(
        array_agg(smil_aarhus.event_template_tr.language_code),
        array_agg(smil_aarhus.event_template_tr.title)
    ) AS title,
    hstore(
        array_agg(smil_aarhus.event_template_tr.language_code),
        array_agg(smil_aarhus.event_template_tr.description)
    ) AS description,
    hstore(
        array_agg(smil_aarhus.event_template_tr.language_code),
        array_agg(smil_aarhus.event_template_tr.venue)
    ) AS venue
FROM
    smil_aarhus.event_template
INNER JOIN
    smil_aarhus.event_template_tr ON
        smil_aarhus.event_template_tr.event_template_id = smil_aarhus.event_template.id
GROUP BY
    smil_aarhus.event_template.id;

COMMENT ON VIEW smil_aarhus_admin.event_template IS E'@primaryKey id';
COMMENT ON COLUMN smil_aarhus_admin.event_template.id IS E'@omit create';
COMMENT ON COLUMN smil_aarhus_admin.event_template.title IS E'@notNull';
COMMENT ON COLUMN smil_aarhus_admin.event_template.description IS E'@notNull';
COMMENT ON COLUMN smil_aarhus_admin.event_template.venue IS E'@notNull';

CREATE TRIGGER update_admin_event_template
    INSTEAD OF INSERT OR UPDATE OR DELETE ON smil_aarhus_admin.event_template FOR EACH ROW -- noqa: L016
    EXECUTE PROCEDURE smil_aarhus_admin.tr_update_implementation('event_template', 'id', 'event_template_tr', 'event_template_id'); -- noqa: L016

GRANT SELECT, INSERT, UPDATE, DELETE ON smil_aarhus_admin.event_template TO smil_organizer, smil_admin;
