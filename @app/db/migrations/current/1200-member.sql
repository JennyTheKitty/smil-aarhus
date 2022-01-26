CREATE TABLE smil_aarhus_private.user_role (
    role text PRIMARY KEY,
    name text NOT NULL
);

COMMENT ON TABLE smil_aarhus_private.user_role IS E'@enum\n@enumDescription name';

GRANT SELECT ON smil_aarhus_private.user_role TO smil_anonymous, smil_organizer, smil_admin;

CREATE TABLE smil_aarhus.member(
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    username citext NOT NULL UNIQUE CHECK(
        length(username) >= 2 AND length(username) <= 32 AND username ~ '^[a-zA-Z]([_]?[a-zA-Z0-9])+$'
    ),
    user_role text NOT NULL REFERENCES smil_aarhus_private.user_role,
    is_active boolean NOT NULL
);

comment on table smil_aarhus.member is E'@simpleCollections both';

CREATE TABLE smil_aarhus_private.member_account(
    member_id uuid PRIMARY KEY REFERENCES smil_aarhus.member(
        id
    ) ON DELETE CASCADE,
    password_hash text NOT NULL
);

-- allow all to see members
GRANT SELECT ON TABLE smil_aarhus.member TO smil_organizer, smil_admin;

-- allow admins users to change members
GRANT UPDATE, DELETE ON TABLE smil_aarhus.member TO smil_admin;
