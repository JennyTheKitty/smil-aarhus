-- Database owner
CREATE ROLE smil_aarhus CREATEDB LOGIN PASSWORD '123';

-- Miminal permissions
CREATE ROLE smil_postgraphile LOGIN PASSWORD 'xyz';

CREATE ROLE smil_admin NOLOGIN;
GRANT smil_admin TO smil_postgraphile;

CREATE ROLE smil_organizer NOLOGIN;
GRANT smil_organizer TO smil_postgraphile;

CREATE ROLE smil_anonymous NOLOGIN;
GRANT smil_anonymous TO smil_postgraphile;
