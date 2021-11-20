CREATE TABLE smil_aarhus.tr_language(
    code text PRIMARY KEY,
    name text NOT NULL,
    tsvector_config regconfig NOT NULL
);

COMMENT ON TABLE smil_aarhus.tr_language IS E'@enum\n@enumDescription name';

-- allow all to see languages
GRANT SELECT ON TABLE smil_aarhus.tr_language TO smil_anonymous, smil_organizer, smil_admin;

CREATE OR REPLACE FUNCTION smil_aarhus.get_tsvector_config_from_code(text)
RETURNS regconfig
AS $func$
    SELECT smil_aarhus.tr_language.tsvector_config
    FROM smil_aarhus.tr_language
    WHERE smil_aarhus.tr_language.code = $1
$func$ LANGUAGE SQL IMMUTABLE
RETURNS NULL ON NULL INPUT;

COMMENT ON FUNCTION smil_aarhus.get_tsvector_config_from_code is E'@omit execute';
