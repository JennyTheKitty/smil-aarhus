CREATE TABLE smil_aarhus.news(
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    published_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

comment on table smil_aarhus.news is E'@simpleCollections both';

CREATE TABLE smil_aarhus.news_tr(
    news_id uuid NOT NULL REFERENCES smil_aarhus.news (id),
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

-- CREATE TYPE smil_aarhus.news_data AS (

-- );

CREATE TYPE smil_aarhus.news_tr_data AS (
    language_code text,
    title text,
    content text
);

COMMENT ON COLUMN smil_aarhus.news_tr_data.language_code IS E'@notNull';
COMMENT ON COLUMN smil_aarhus.news_tr_data.title IS E'@notNull';
COMMENT ON COLUMN smil_aarhus.news_tr_data.content IS E'@notNull';

CREATE OR REPLACE FUNCTION smil_aarhus.upsert_news(
    -- data smil_aarhus.news_data,
    translations smil_aarhus.news_tr_data[],
    news__id uuid DEFAULT NULL
)
RETURNS smil_aarhus.news
AS $$
DECLARE
    _news smil_aarhus.news;
    trans smil_aarhus.news_tr_data;
BEGIN
    IF (news__id IS NULL) THEN
        INSERT INTO smil_aarhus.news(published_at, updated_at)
            VALUES (now(), now())
            RETURNING * INTO STRICT _news;
    ELSE
        UPDATE smil_aarhus.news
            SET updated_at = now()
            WHERE id = news__id
            RETURNING * INTO STRICT _news;
    END IF;

    FOREACH trans IN ARRAY translations LOOP
        INSERT INTO smil_aarhus.news_tr (news_id, language_code, title, content)
            VALUES (_news.id, trans.language_code, trans.title, trans.content)
            ON CONFLICT (news_id, language_code) DO UPDATE SET language_code = trans.language_code, title = trans.title, content = trans.content;
    END LOOP;
    DELETE FROM smil_aarhus.news_tr
        WHERE (news_id = _news.id and language_code NOT IN (SELECT language_code FROM UNNEST(translations)));

    RETURN _news;
END
$$ LANGUAGE plpgsql;


GRANT EXECUTE ON FUNCTION smil_aarhus.upsert_news TO smil_organizer, smil_admin;
