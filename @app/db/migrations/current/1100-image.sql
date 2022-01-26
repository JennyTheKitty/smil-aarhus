create table image (
  id uuid primary key DEFAULT gen_random_uuid(),
  path text NOT NULL,
  width integer not null,
  height integer not null,
  credit text NOT NULL
);

COMMENT ON TABLE smil_aarhus.image IS E'@omit all,order';

GRANT SELECT ON TABLE smil_aarhus.image TO smil_anonymous, smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.image TO smil_organizer, smil_admin;



