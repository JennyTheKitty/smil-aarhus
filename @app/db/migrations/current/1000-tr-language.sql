CREATE TABLE smil_aarhus.tr_language(
    code text PRIMARY KEY,
    name text NOT NULL
);

COMMENT ON TABLE smil_aarhus.tr_language IS E'@enum\n@enumDescription name';

-- allow all to see languages
GRANT SELECT ON TABLE smil_aarhus.tr_language TO smil_anonymous, smil_organizer, smil_admin;
