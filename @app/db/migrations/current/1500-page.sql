CREATE TABLE smil_aarhus.page(
    name text NOT NULL PRIMARY KEY
);

CREATE TABLE smil_aarhus.page_tr(
    page_name text NOT NULL REFERENCES smil_aarhus.page (name),
    language_code text NOT NULL REFERENCES smil_aarhus.tr_language (code),
    content text NOT NULL,
    PRIMARY KEY (page_name, language_code)
);

COMMENT ON CONSTRAINT page_tr_page_name_fkey ON smil_aarhus.page_tr IS E'@foreignFieldName translations';

GRANT SELECT ON TABLE smil_aarhus.page TO smil_anonymous, smil_organizer, smil_admin;
GRANT SELECT ON TABLE smil_aarhus.page_tr TO smil_anonymous, smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.page TO smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.page_tr TO smil_organizer, smil_admin;


CREATE TABLE smil_aarhus.info_page(
    name text NOT NULL PRIMARY KEY REFERENCES smil_aarhus.page (name),
    icon text NOT NULL
);

CREATE TABLE smil_aarhus.info_page_tr(
    info_page_name text NOT NULL REFERENCES smil_aarhus.info_page (name),
    language_code text NOT NULL REFERENCES smil_aarhus.tr_language (code),
    title text NOT NULL,
    subtitle text NOT NULL,
    PRIMARY KEY (info_page_name, language_code)
);

COMMENT ON CONSTRAINT info_page_tr_info_page_name_fkey ON smil_aarhus.info_page_tr IS E'@foreignFieldName translations';

GRANT SELECT ON TABLE smil_aarhus.info_page TO smil_anonymous, smil_organizer, smil_admin;
GRANT SELECT ON TABLE smil_aarhus.info_page_tr TO smil_anonymous, smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.info_page TO smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.info_page_tr TO smil_organizer, smil_admin;
