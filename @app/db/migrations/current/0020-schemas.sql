-- Create schemas
CREATE SCHEMA smil_aarhus;
CREATE SCHEMA smil_aarhus_private;
CREATE SCHEMA smil_aarhus_admin;

-- Allow all to use schemas (NOT private)
GRANT USAGE ON SCHEMA public, smil_aarhus, smil_aarhus_admin TO smil_anonymous, smil_organizer, smil_admin;

-- Postgraphile needs to login
GRANT USAGE ON SCHEMA smil_aarhus_private TO smil_postgraphile;

-- Allow logged in to use sequences (to insert data)
ALTER DEFAULT PRIVILEGES IN SCHEMA public, smil_aarhus, smil_aarhus_admin
GRANT USAGE, SELECT ON SEQUENCES TO smil_organizer, smil_admin;

-- Allow all to execute function
ALTER DEFAULT PRIVILEGES IN SCHEMA public, smil_aarhus
GRANT EXECUTE ON FUNCTIONS TO smil_anonymous, smil_organizer, smil_admin;
-- only logged in can execute admin funcs
ALTER DEFAULT PRIVILEGES IN SCHEMA smil_aarhus_admin
GRANT EXECUTE ON FUNCTIONS TO smil_organizer, smil_admin;
