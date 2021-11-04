CREATE VIEW smil_aarhus_admin.event AS
SELECT
    smil_aarhus.event.id,
    smil_aarhus.event.starts_at,
    smil_aarhus.event.ends_at,
    smil_aarhus.event.category_id,
    smil_aarhus.event.special,
    hstore(
        array_agg(smil_aarhus.event_tr.language_code),
        array_agg(smil_aarhus.event_tr.title)
    ) AS title,
    hstore(
        array_agg(smil_aarhus.event_tr.language_code),
        array_agg(smil_aarhus.event_tr.description)
    ) AS description,
    hstore(
        array_agg(smil_aarhus.event_tr.language_code),
        array_agg(smil_aarhus.event_tr.venue)
    ) AS venue
FROM
    smil_aarhus.event
INNER JOIN
    smil_aarhus.event_tr ON smil_aarhus.event_tr.event_id = smil_aarhus.event.id
GROUP BY
    smil_aarhus.event.id;

COMMENT ON VIEW smil_aarhus_admin.event IS E'@primaryKey id';
COMMENT ON COLUMN smil_aarhus_admin.event.id IS E'@omit create';
COMMENT ON COLUMN smil_aarhus_admin.event.starts_at IS E'@notNull';
COMMENT ON COLUMN smil_aarhus_admin.event.ends_at IS E'@notNull';
COMMENT ON COLUMN smil_aarhus_admin.event.special IS E'@notNull';
COMMENT ON COLUMN smil_aarhus_admin.event.category_id IS E'@notNull';
COMMENT ON COLUMN smil_aarhus_admin.event.title IS E'@notNull';
COMMENT ON COLUMN smil_aarhus_admin.event.description IS E'@notNull';
COMMENT ON COLUMN smil_aarhus_admin.event.venue IS E'@notNull';

CREATE TRIGGER update_admin_event
    INSTEAD OF INSERT OR UPDATE OR DELETE ON smil_aarhus_admin.event FOR EACH ROW
    EXECUTE PROCEDURE smil_aarhus_admin.tr_update_implementation('event', 'id', 'event_tr', 'event_id'); -- noqa: L016

GRANT SELECT, INSERT, UPDATE, DELETE ON smil_aarhus_admin.event TO smil_organizer, smil_admin;
