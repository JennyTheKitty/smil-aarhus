CREATE SEQUENCE picture_rank AS integer;

CREATE TABLE smil_aarhus.picture(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    image uuid NOT NULL REFERENCES smil_aarhus.image(id),
    rank integer NOT NULL DEFAULT nextval('picture_rank'),
    allow_on_home bool NOT NULL DEFAULT FALSE
);
ALTER SEQUENCE picture_rank OWNED BY smil_aarhus.picture.rank;

COMMENT ON TABLE smil_aarhus.picture IS E'@omit filter';

GRANT SELECT ON TABLE smil_aarhus.picture TO smil_anonymous, smil_organizer, smil_admin;
GRANT INSERT, UPDATE, DELETE ON TABLE smil_aarhus.picture TO smil_organizer, smil_admin;


create function smil_aarhus.random_pictures()
returns setof smil_aarhus.picture
as $$
select * from smil_aarhus.picture where allow_on_home = TRUE order by random() ;
$$ language sql stable;

GRANT EXECUTE ON FUNCTION smil_aarhus.random_pictures TO smil_anonymous, smil_organizer, smil_admin;

Create type smil_aarhus.reorder_pictures_reorder AS (
    from_rank integer,
    to_rank integer
);

CREATE OR REPLACE FUNCTION smil_aarhus.reorder_pictures(
    reorders smil_aarhus.reorder_pictures_reorder[]
)
RETURNS bool
AS $$
BEGIN
    update smil_aarhus.picture set rank = c.to_rank
    from (select from_rank, to_rank from unnest(reorders)) as c(from_rank, to_rank)
    where c.from_rank = smil_aarhus.picture.rank;
    RETURN TRUE;
END
$$ LANGUAGE plpgsql;


GRANT EXECUTE ON FUNCTION smil_aarhus.reorder_pictures TO smil_organizer, smil_admin;
