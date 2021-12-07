CREATE TABLE smil_aarhus.group(
    id bigserial PRIMARY KEY,
    image bigint REFERENCES smil_aarhus.image(id)
);


COMMENT ON TABLE smil_aarhus.group IS E'@omit create,update,delete';

CREATE TABLE smil_aarhus.group_tr(
    group_id bigint REFERENCES smil_aarhus.group (id),
    language_code text REFERENCES smil_aarhus.tr_language (code),
    title text NOT NULL,
    short_description text NOT NULL,
    description text NOT NULL,
    slug text NOT NULL,
    PRIMARY KEY (group_id, language_code),
    UNIQUE (slug, language_code)
);

CREATE OR REPLACE FUNCTION smil_aarhus.group_by_slug(slug text, preferred_language_code TEXT)
RETURNS smil_aarhus.group
AS $$
DECLARE
    tr record;
    group smil_aarhus.group;
    _slug alias FOR slug;
BEGIN
    SELECT INTO tr group_id from smil_aarhus.group_tr where (smil_aarhus.group_tr.slug = _slug and smil_aarhus.group_tr.language_code = preferred_language_code);
    IF (tr IS NULL) THEN
        SELECT INTO tr group_id from smil_aarhus.group_tr where (smil_aarhus.group_tr.slug = _slug) LIMIT 1;
    END IF;
    SELECT INTO group * from smil_aarhus.group where (smil_aarhus.group.id = tr.group_id);
    RETURN group;
END
$$ LANGUAGE plpgsql STABLE;


COMMENT ON TABLE smil_aarhus.group_tr IS E'@omit create,update,delete';

COMMENT ON CONSTRAINT group_tr_group_id_fkey ON smil_aarhus.group_tr IS E'@foreignFieldName translations';

GRANT SELECT ON TABLE smil_aarhus.group TO smil_anonymous, smil_organizer, smil_admin;
GRANT SELECT ON TABLE smil_aarhus.group_tr TO smil_anonymous, smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.group TO smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.group_tr TO smil_organizer, smil_admin;

CREATE TRIGGER add_group_tr_slug BEFORE INSERT ON smil_aarhus.group_tr FOR EACH ROW
WHEN (NEW.title IS NOT NULL AND NEW.slug IS NULL)
EXECUTE PROCEDURE smil_aarhus.tr_set_slug('group', 'id', 'group_id', 'false');

CREATE INDEX group_tr_title_trgm_index on smil_aarhus.group_tr using gin(title gin_trgm_ops);

CREATE OR REPLACE FUNCTION smil_aarhus.search_groups(query text)
returns setof smil_aarhus.group
as $$
SELECT DISTINCT smil_aarhus.group.*
FROM
  smil_aarhus.group_tr
  inner join smil_aarhus.group ON smil_aarhus.group_tr.group_id = smil_aarhus.group.id
WHERE similarity(smil_aarhus.group_tr.title, query) > 0.1 ;
$$ language sql stable;

create table smil_aarhus.event_via_group (
  event_id bigint constraint event_via_group_event_id_fkey references smil_aarhus.event (id),
  group_id bigint constraint event_via_group_group_id_fkey references smil_aarhus.group (id),
  primary key (event_id, group_id)
);

comment on table smil_aarhus.event_via_group is E'@omit all';


comment on constraint event_via_group_event_id_fkey on smil_aarhus.event_via_group is E'@foreignFieldName groups\n@manyToManyFieldName groups';
comment on constraint event_via_group_group_id_fkey on smil_aarhus.event_via_group is E'@foreignFieldName events\n@manyToManyFieldName events';

GRANT SELECT ON TABLE smil_aarhus.event_via_group TO smil_anonymous, smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.event_via_group TO smil_organizer, smil_admin;
