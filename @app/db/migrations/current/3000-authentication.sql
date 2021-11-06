CREATE TYPE smil_aarhus.jwt_token AS (
    role text,
    sub uuid,
    exp bigint
);

CREATE FUNCTION smil_aarhus_private.authenticate(username text, password text)
RETURNS smil_aarhus.jwt_token
AS $$
DECLARE
    member record;
BEGIN
    SELECT
        * INTO member
    FROM
        smil_aarhus.member AS mem
        INNER JOIN smil_aarhus_private.member_account AS acc ON acc.member_id = mem.id
    WHERE
        mem.username = $1;
    IF member.password_hash = crypt(password, member.password_hash) THEN
        RETURN (
            member.user_role,
            member.member_id,
            EXTRACT(epoch FROM (now() + interval '15 min'))
        )::smil_aarhus.jwt_token;
    ELSE
        RETURN NULL;
    END IF;
END;
$$ LANGUAGE plpgsql STRICT SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION smil_aarhus_private.authenticate TO :DATABASE_AUTHENTICATOR;


CREATE FUNCTION smil_aarhus_admin.current_member()
RETURNS smil_aarhus_admin.member
AS $$
SELECT
    *
FROM
    smil_aarhus_admin.member
WHERE
    id = NULLIF(current_setting('jwt.claims.sub', TRUE), '')::uuid
$$ LANGUAGE SQL STABLE;
