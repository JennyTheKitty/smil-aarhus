CREATE OR REPLACE FUNCTION smil_aarhus.array_diff(
    array1 anyarray, array2 anyarray
)
RETURNS anyarray
AS $$
BEGIN
    RETURN(SELECT
        COALESCE(ARRAY_AGG(elem), '{}')
    FROM
        UNNEST(array1) elem
    WHERE
        elem <> ALL (array2));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION smil_aarhus.format_array(
    arr text[], format_str text, delim text
)
RETURNS text
AS $$
DECLARE
    _i text;
    _tmp text[];
BEGIN
    _tmp := '{}';
    FOREACH _i IN ARRAY arr LOOP
        _tmp := _tmp || format(format_str, _i);
    END LOOP;
    RETURN ARRAY_TO_STRING(_tmp, delim, '*');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION smil_aarhus.get_columns(
    table_name text, exclude_columns text[]
)
RETURNS text[]
AS $$
DECLARE
    _tmp text[];
BEGIN
    EXECUTE format($q$
        SELECT
            smil_aarhus.array_diff(ARRAY_AGG(column_name), %2$L)
        FROM
            information_schema.columns
        WHERE
            table_name = %1$L
            AND table_schema = 'smil_aarhus';
    $q$, table_name, exclude_columns) INTO _tmp;
    RETURN _tmp;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION smil_aarhus.slugify(t text) RETURNS text
AS $$
BEGIN
	t := regexp_replace(t, '[Åå]', 'aa', 'g');
	t := regexp_replace(t, '[Øø]', 'oe', 'g');
	t := regexp_replace(t, '[Ææ]', 'ae', 'g');
	t := unaccent(t);
	t := lower(t);
	t := regexp_replace(t, '[''"]+', '', 'gi');
	t := regexp_replace(t, '[^a-z0-9\\-_]+', '-', 'gi');
	t := regexp_replace(t, '\-+$', '');
	t := regexp_replace(t, '^\-', '');
	RETURN t;
END;
$$ LANGUAGE plpgsql STRICT IMMUTABLE PARALLEL SAFE;

CREATE OR REPLACE FUNCTION smil_aarhus.f_regexp_escape(text)
RETURNS text
AS $func$
SELECT regexp_replace($1, '([!$()*+.:<=>?[\\\]^{|}-])', '\\\1', 'g')
$func$ LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE;
