CREATE VIEW smil_aarhus_admin.event_category AS
SELECT
    smil_aarhus.event_category.id,
    hstore(
        array_agg(smil_aarhus.event_category_tr.language_code),
        array_agg(smil_aarhus.event_category_tr.title)
    ) AS title
FROM
    smil_aarhus.event_category
INNER JOIN
    smil_aarhus.event_category_tr ON
        smil_aarhus.event_category_tr.category_id = smil_aarhus.event_category.id
GROUP BY
    smil_aarhus.event_category.id;

COMMENT ON VIEW smil_aarhus_admin.event_category IS E'@primaryKey id';
COMMENT ON COLUMN smil_aarhus_admin.event_category.id IS E'@omit create';
COMMENT ON COLUMN smil_aarhus_admin.event_category.title IS E'@notNull';

CREATE TRIGGER update_admin_event_category
    INSTEAD OF INSERT OR UPDATE OR DELETE ON smil_aarhus_admin.event_category FOR EACH ROW -- noqa: L016
    EXECUTE PROCEDURE smil_aarhus_admin.tr_update_implementation('event_category', 'id', 'event_category_tr', 'category_id'); -- noqa: L016

GRANT SELECT, INSERT, UPDATE, DELETE ON smil_aarhus_admin.event_category TO smil_organizer, smil_admin;
