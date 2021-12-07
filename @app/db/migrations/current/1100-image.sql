create table image (
  id bigserial primary key,
  path text NOT NULL,
  width integer not null,
  height integer not null
);


GRANT SELECT ON TABLE smil_aarhus.image TO smil_anonymous, smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.image TO smil_organizer, smil_admin;



