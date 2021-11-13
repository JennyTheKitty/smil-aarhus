CREATE OR REPLACE FUNCTION smil_aarhus_admin.tr_update_implementation()
RETURNS TRIGGER
AS $func$
DECLARE
    _tbl_columns text[];
    _tr_columns text[];
    _query text;
    _l record;
    _lang record;
    tbl text := TG_ARGV[0];
    tbl_id text := TG_ARGV[1];
    tr_tbl text := TG_ARGV[2];
    tr_tbl_id text := TG_ARGV[3];
BEGIN
    IF (TG_OP = 'DELETE') THEN
        EXECUTE format($q$
            DELETE FROM
                smil_aarhus.%1$I
            WHERE
                %2$I = OLD.%2$I;
        $q$, tbl, tbl_id);
        EXECUTE format($q$
            DELETE FROM
                smil_aarhus.%1$I
            WHERE
                %2$I = OLD.%3$I;
        $q$, _tr_tbl, _tr_tbl_id, _tbl_id);
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE' OR TG_OP = 'INSERT') THEN
        SELECT
            smil_aarhus.get_columns(tbl, ARRAY[tbl_id]) INTO _tbl_columns;
        SELECT
            smil_aarhus.get_columns(tr_tbl, ARRAY[tr_tbl_id, 'language_code']) INTO _tr_columns;

        IF (TG_OP = 'UPDATE') THEN
            IF ARRAY_LENGTH(_tbl_columns, 1) > 0 THEN
                EXECUTE format($q$
                    UPDATE
                        smil_aarhus.%1$I
                    SET %3$s
                    WHERE
                        %2$I = $2.%2$I;
                $q$, tbl, tbl_id,
                    smil_aarhus.format_array (_tbl_columns, '%1$I = $1.%1$I', ','))
                    USING NEW, OLD;
            END IF;
            _query := format($q$
                SELECT
                    code, new_has, old_has
                FROM
                    smil_aarhus.tr_language tl
                    FULL OUTER JOIN UNNEST(akeys($1.%1$I::hstore)) new_has ON new_has = tl.code
                    FULL OUTER JOIN UNNEST(akeys($2.%1$I::hstore)) old_has ON old_has = tl.code;
            $q$, _tr_columns[1]);
            FOR _lang IN EXECUTE _query USING NEW, OLD LOOP
                IF (_lang.new_has IS NOT NULL AND _lang.old_has IS NOT NULL) THEN
                    _query := $q$UPDATE smil_aarhus.%1$I  SET %5$s WHERE %3$I = $2.%2$I AND language_code = $3;$q$; -- noqa: L016
                ELSIF (_lang.new_has IS NOT NULL AND _lang.old_has IS NULL) THEN
                        _query := $q$INSERT INTO smil_aarhus.%1$IVALUES ($2.%2$I, $3, %4$s);$q$;
                ELSIF (_lang.new_has IS NULL AND _lang.old_has IS NOT NULL) THEN
                        _query := $q$DELETE FROM smil_aarhus.%1$I WHERE %3$I = OLD.%2$I AND language_code = $3;$q$; -- noqa: L016
                END IF;
                _query := format(
                    _query,
                    tr_tbl,
                    tbl_id,
                    tr_tbl_id,
                    smil_aarhus.format_array(_tr_columns, '$1.%1$I -> $3', ','),
                    smil_aarhus.format_array(_tr_columns, '%1$I = $1.%1$I -> $3', ',')
                );
                EXECUTE _query USING NEW, OLD, _lang.code;
            END LOOP;
            RETURN NEW;
        ELSIF (TG_OP = 'INSERT') THEN
            IF ARRAY_LENGTH(_tbl_columns, 1) > 0 THEN
                _query := format($q$
                    INSERT INTO
                        smil_aarhus.%1$I
                    VALUES (DEFAULT, %3$s)
                    RETURNING %2$I
                $q$, tbl, tbl_id, smil_aarhus.format_array(_tbl_columns, '$1.%1$I', ','));
            ELSE
                _query := format($q$
                    INSERT INTO
                        smil_aarhus.%1$I
                    VALUES (DEFAULT)
                    RETURNING %2$I
                $q$, tbl, tbl_id);
            END IF;
            EXECUTE _query USING NEW INTO _l;
            NEW.id := _l.id;
            _query := format($q$
                SELECT
                    code, new_has
                FROM
                    smil_aarhus.tr_language tl
                    FULL OUTER JOIN unnest(akeys($1.%1$I::hstore)) new_has ON new_has = tl.code;
            $q$, _tr_columns[1]);
            FOR _lang IN EXECUTE _query USING NEW LOOP
                IF (_lang.new_has IS NOT NULL) THEN
                    _query := $q$
                        INSERT INTO
                            smil_aarhus.%1$I
                        VALUES ($1.%2$I, $2, %3$s);
                    $q$;
                    _query := format(_query, tr_tbl, tbl_id, smil_aarhus.format_array(_tr_columns, '$1.%1$I -> $2', ',')); -- noqa: L016
                    EXECUTE _query USING NEW, _lang.code;
                END IF;
            END LOOP;
            RETURN NEW;
        END IF;
    END IF;
END;
$func$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION smil_aarhus.tr_set_slug()
RETURNS TRIGGER
AS $func$
DECLARE
    tbl text := TG_ARGV[0];
    tbl_id text := TG_ARGV[1];
    tr_tbl_id text := TG_ARGV[2];
    dated boolean := TG_ARGV[3];
    _l record;
    _cnt record;
    _slug text;
BEGIN
    IF (dated) THEN
        -- Get start date
        EXECUTE format($q$
            SELECT starts_at
            FROM smil_aarhus.%1$I
            WHERE %2$I = $1.%3$I;
        $q$, tbl, tbl_id, tr_tbl_id) USING NEW INTO _l;

        -- Create slug
        _slug := to_char(_l.starts_at, 'YYYY-MM-DD-') || smil_aarhus.slugify(NEW.title);
    ELSE
        _slug := smil_aarhus.slugify(NEW.title);
    END IF;

    -- Check for conflicts
    EXECUTE format($q$
        SELECT count(1) cnt
        FROM SMIL_AARHUS.%1$I x
        WHERE x.slug ~ ('^' || $1 || '(\-\d+)?$') AND x.language_code = $2.language_code;
    $q$, TG_TABLE_NAME) USING _slug, NEW INTO _cnt;

    IF (_cnt.cnt > 0) THEN
        _slug := _slug || '-' || (_cnt.cnt);
    END IF;

    NEW.slug := _slug;
    RETURN NEW;
END
$func$ LANGUAGE plpgsql;
