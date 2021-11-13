CREATE VIEW smil_aarhus_admin.group AS
SELECT
    smil_aarhus.group.id,
    smil_aarhus.group.image_file,
    hstore(
        array_agg(smil_aarhus.group_tr.language_code),
        array_agg(smil_aarhus.group_tr.title)
    ) AS title,
    hstore(
        array_agg(smil_aarhus.group_tr.language_code),
        array_agg(smil_aarhus.group_tr.description)
    ) AS description,
    hstore(
        array_agg(smil_aarhus.group_tr.language_code),
        array_agg(smil_aarhus.group_tr.slug)
    ) AS slug
FROM
    smil_aarhus.group
INNER JOIN
    smil_aarhus.group_tr ON
        smil_aarhus.group_tr.group_id = smil_aarhus.group.id
GROUP BY
    smil_aarhus.group.id;

COMMENT ON VIEW smil_aarhus_admin.group IS E'@primaryKey id';
COMMENT ON COLUMN smil_aarhus_admin.group.id IS E'@omit create';
COMMENT ON COLUMN smil_aarhus_admin.group.image_file IS E'@notNull';
COMMENT ON COLUMN smil_aarhus_admin.group.title IS E'@notNull';
COMMENT ON COLUMN smil_aarhus_admin.group.description IS E'@notNull';

CREATE TRIGGER update_admin_group
    INSTEAD OF INSERT OR UPDATE OR DELETE ON smil_aarhus_admin.group FOR EACH ROW -- noqa: L016
    EXECUTE PROCEDURE smil_aarhus_admin.tr_update_implementation('group', 'id', 'group_tr', 'group_id'); -- noqa: L016

GRANT SELECT, INSERT, UPDATE, DELETE ON smil_aarhus_admin.group TO smil_organizer, smil_admin;
