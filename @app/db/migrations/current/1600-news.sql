CREATE TABLE smil_aarhus.news(
    id bigserial NOT NULL PRIMARY KEY,
    published_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE smil_aarhus.news_tr(
    news_id bigint NOT NULL REFERENCES smil_aarhus.news (id),
    language_code text NOT NULL REFERENCES smil_aarhus.tr_language (code),
    title text NOT NULL,
    content text NOT NULL,
    PRIMARY KEY (news_id, language_code)
);

COMMENT ON TABLE smil_aarhus.news_tr IS E'@omit create,update,delete,all,order';

COMMENT ON CONSTRAINT news_tr_news_id_fkey ON smil_aarhus.news_tr IS E'@foreignFieldName translations';

GRANT SELECT ON TABLE smil_aarhus.news TO smil_anonymous, smil_organizer, smil_admin;
GRANT SELECT ON TABLE smil_aarhus.news_tr TO smil_anonymous, smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.news TO smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.news_tr TO smil_organizer, smil_admin;

