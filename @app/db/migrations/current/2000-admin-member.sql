CREATE VIEW smil_aarhus_admin.member AS
SELECT
    id,
    username,
    name,
    user_role,
    is_active
FROM
    smil_aarhus.member
;

COMMENT ON VIEW smil_aarhus_admin.member IS E'@primaryKey id';
--COMMENT ON COLUMN smil_aarhus_admin.member.id IS E'@omit create';
--COMMENT ON COLUMN smil_aarhus_admin.member.username IS E'@omit create';
--COMMENT ON COLUMN smil_aarhus_admin.member.name IS E'@omit create';
--COMMENT ON COLUMN smil_aarhus_admin.member.user_role IS E'@omit create';
--COMMENT ON COLUMN smil_aarhus_admin.member.is_active IS E'@omit create';

--COMMENT ON VIEW smil_aarhus_admin.member IS E'@omit create';


GRANT SELECT ON smil_aarhus_admin.member TO smil_anonymous, smil_organizer, smil_admin;

/*CREATE TYPE smil_aarhus_admin.create_member_input AS (
    name text,
    user_role text,
    username citext,
    password text,
    is_active boolean
);

COMMENT ON TYPE smil_aarhus_admin.create_member_input IS E'@name member_input';

COMMENT ON COLUMN smil_aarhus_admin.create_member_input.name IS E'@notNull';
COMMENT ON COLUMN smil_aarhus_admin.create_member_input.user_role IS E'@notNull';
COMMENT ON COLUMN smil_aarhus_admin.create_member_input.username IS E'@notNull';
COMMENT ON COLUMN smil_aarhus_admin.create_member_input.password IS E'@notNull';
COMMENT ON COLUMN smil_aarhus_admin.create_member_input.is_active IS E'@notNull';

CREATE OR REPLACE FUNCTION smil_aarhus_admin.create_member(
    member smil_aarhus_admin.create_member_input
)
RETURNS smil_aarhus_admin.member
AS $$
BEGIN
    -- SNIP
END;
$$ LANGUAGE plpgsql STRICT;


GRANT EXECUTE ON FUNCTION smil_aarhus_admin.create_member TO smil_admin;
*/
