CREATE TABLE smil_aarhus.event_tag(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    image uuid REFERENCES smil_aarhus.image(id)
);


COMMENT ON TABLE smil_aarhus.event_tag IS E'@omit create,update,delete,all,order';

CREATE TABLE smil_aarhus.event_tag_tr(
    tag_id uuid constraint event_tag_tr_tag_id_fkey REFERENCES smil_aarhus.event_tag(id),
    language_code text constraint event_tag_tr_language_code_fkey REFERENCES smil_aarhus.tr_language(code),
    title text NOT NULL,
    PRIMARY KEY (tag_id, language_code)
);


COMMENT ON TABLE smil_aarhus.event_tag_tr IS E'@omit create,update,delete,all,order';

COMMENT ON CONSTRAINT event_tag_tr_tag_id_fkey ON smil_aarhus.event_tag_tr IS E'@foreignFieldName translations';

GRANT SELECT ON TABLE smil_aarhus.event_tag TO smil_anonymous, smil_organizer, smil_admin;
GRANT SELECT ON TABLE smil_aarhus.event_tag_tr TO smil_anonymous, smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.event_tag TO smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.event_tag_tr TO smil_organizer, smil_admin;

CREATE INDEX event_tag_tr_title_trgm_index on smil_aarhus.event_tag_tr using gin(title gin_trgm_ops);

CREATE OR REPLACE FUNCTION smil_aarhus.search_event_tags(query text)
returns setof smil_aarhus.event_tag
as $$
BEGIN
    IF (query = '') THEN
        RETURN QUERY SELECT DISTINCT smil_aarhus.event_tag.*
        FROM
        smil_aarhus.event_tag_tr
        inner join smil_aarhus.event_tag ON smil_aarhus.event_tag_tr.tag_id = smil_aarhus.event_tag.id;
    ELSE
        RETURN QUERY SELECT
            id, image
        FROM
            (SELECT DISTINCT
                smil_aarhus.event_tag.*,
                similarity (smil_aarhus.event_tag_tr.title, query) AS X
            FROM
                smil_aarhus.event_tag_tr
                INNER JOIN smil_aarhus.event_tag ON smil_aarhus.event_tag_tr.tag_id = smil_aarhus.event_tag.id
            WHERE
                similarity (smil_aarhus.event_tag_tr.title, query) > 0.05
            ) AS g
        ORDER BY
            X;
    END IF;
END
$$ language plpgsql stable;


create table smil_aarhus.event_via_event_tag (
  event_id uuid constraint event_via_event_tag_event_id_fkey references smil_aarhus.event (id),
  tag_id uuid constraint event_via_event_tag_tag_id_fkey references smil_aarhus.event_tag (id),
  primary key (event_id, tag_id)
);

comment on table smil_aarhus.event_via_event_tag is E'@omit all,create,delete,update,order,filter';

comment on constraint event_via_event_tag_tag_id_fkey on smil_aarhus.event_via_event_tag is E'@foreignFieldName events\n@manyToManyFieldName events';
comment on constraint event_via_event_tag_event_id_fkey on smil_aarhus.event_via_event_tag is E'@foreignFieldName tags\n@manyToManyFieldName tags';

GRANT SELECT ON TABLE smil_aarhus.event_via_event_tag TO smil_anonymous, smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.event_via_event_tag TO smil_organizer, smil_admin;
