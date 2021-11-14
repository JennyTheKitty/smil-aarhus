CREATE TABLE smil_aarhus.event_tag(
    id bigserial PRIMARY KEY,
    image_file text
);

CREATE TABLE smil_aarhus.event_tag_tr(
    tag_id bigint constraint event_tag_tr_tag_id_fkey REFERENCES smil_aarhus.event_tag(id),
    language_code text constraint event_tag_tr_language_code_fkey REFERENCES smil_aarhus.tr_language(code),
    title text NOT NULL,
    PRIMARY KEY (tag_id, language_code)
);

COMMENT ON CONSTRAINT event_tag_tr_tag_id_fkey ON smil_aarhus.event_tag_tr IS E'@foreignFieldName translations';

GRANT SELECT ON TABLE smil_aarhus.event_tag TO smil_anonymous, smil_organizer, smil_admin;
GRANT SELECT ON TABLE smil_aarhus.event_tag_tr TO smil_anonymous, smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.event_tag TO smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.event_tag_tr TO smil_organizer, smil_admin;

create table smil_aarhus.event_via_event_tag (
  event_id bigint constraint event_via_event_tag_event_id_fkey references smil_aarhus.event (id),
  tag_id int constraint event_via_event_tag_tag_id_fkey references smil_aarhus.event_tag (id),
  primary key (event_id, tag_id)
);

comment on table smil_aarhus.event_via_event_tag is E'@omit all';

comment on constraint event_via_event_tag_tag_id_fkey on smil_aarhus.event_via_event_tag is E'@manyToManyFieldName tags';

GRANT SELECT ON TABLE smil_aarhus.event_via_event_tag TO smil_anonymous, smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.event_via_event_tag TO smil_organizer, smil_admin;
