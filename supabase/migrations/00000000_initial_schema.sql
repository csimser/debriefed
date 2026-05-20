--
-- PostgreSQL database dump
--

\restrict 4bYBvDcPudKqJnCSs8TOCIUAAXdIoZijnRXHHXXAQO1mnLjw7Ok8b8fn5FZK3Uc

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.10 (Ubuntu 17.10-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA auth;


--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA extensions;


--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA graphql;


--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA graphql_public;


--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA pgbouncer;


--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA realtime;


--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA storage;


--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA vault;


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


--
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_authorization_status AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


--
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_client_type AS ENUM (
    'public',
    'confidential'
);


--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


--
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_response_type AS ENUM (
    'code'
);


--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


--
-- Name: action; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: -
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS',
    'VECTOR'
);


--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: graphql(text, text, jsonb, jsonb); Type: FUNCTION; Schema: graphql_public; Owner: -
--

CREATE FUNCTION graphql_public.graphql("operationName" text DEFAULT NULL::text, query text DEFAULT NULL::text, variables jsonb DEFAULT NULL::jsonb, extensions jsonb DEFAULT NULL::jsonb) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: -
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $_$
  BEGIN
      RAISE DEBUG 'PgBouncer auth request: %', p_usename;

      RETURN QUERY
      SELECT
          rolname::text,
          CASE WHEN rolvaliduntil < now()
              THEN null
              ELSE rolpassword::text
          END
      FROM pg_authid
      WHERE rolname=$1 and rolcanlogin;
  END;
  $_$;


--
-- Name: approve_ai_translation(uuid, uuid, text, text, text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.approve_ai_translation(p_translation_id uuid, p_admin_id uuid, p_dict_table text DEFAULT NULL::text, p_military_override text DEFAULT NULL::text, p_civilian_override text DEFAULT NULL::text, p_notes text DEFAULT NULL::text) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_rec RECORD;
  v_military TEXT;
  v_civilian TEXT;
  v_table TEXT;
  v_entry_id UUID;
BEGIN
  SELECT * INTO v_rec FROM ai_generated_translations WHERE id = p_translation_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Translation not found';
  END IF;

  v_military := COALESCE(p_military_override, v_rec.military_term);
  v_civilian := COALESCE(p_civilian_override, v_rec.civilian_translation);
  v_table := COALESCE(p_dict_table, v_rec.suggested_table, 'dict_phrase_translations');

  IF v_civilian IS NULL OR v_civilian = '' THEN
    RAISE EXCEPTION 'No civilian translation provided';
  END IF;

  -- Insert into the correct dictionary table
  IF v_table = 'dict_acronyms' THEN
    INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category)
    VALUES (UPPER(v_military), v_civilian, v_civilian, v_rec.branch, 'ai_generated')
    ON CONFLICT DO NOTHING
    RETURNING id INTO v_entry_id;

  ELSIF v_table = 'dict_military_jargon' THEN
    INSERT INTO dict_military_jargon (military_term, civilian_equivalent, branch, category)
    VALUES (v_military, v_civilian, v_rec.branch, 'ai_generated')
    ON CONFLICT DO NOTHING
    RETURNING id INTO v_entry_id;

  ELSIF v_table = 'dict_phrase_translations' THEN
    INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category)
    VALUES (v_military, v_civilian, v_rec.branch, 'ai_generated')
    ON CONFLICT DO NOTHING
    RETURNING id INTO v_entry_id;

  ELSIF v_table = 'dict_bullet_patterns' THEN
    INSERT INTO dict_bullet_patterns (pattern_template, category, branch)
    VALUES (v_civilian, 'ai_generated', v_rec.branch)
    ON CONFLICT DO NOTHING
    RETURNING id INTO v_entry_id;

  ELSE
    -- Default to phrase translations
    INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category)
    VALUES (v_military, v_civilian, v_rec.branch, 'ai_generated')
    ON CONFLICT DO NOTHING
    RETURNING id INTO v_entry_id;
  END IF;

  -- Update the AI translation record
  UPDATE ai_generated_translations
  SET status = CASE WHEN p_military_override IS NOT NULL OR p_civilian_override IS NOT NULL THEN 'modified' ELSE 'approved' END,
      approved_by = p_admin_id,
      approved_at = NOW(),
      dict_table = v_table,
      dict_entry_id = v_entry_id,
      notes = p_notes,
      military_term = v_military,
      civilian_translation = v_civilian
  WHERE id = p_translation_id;

  RETURN v_entry_id;
END;
$$;


--
-- Name: approve_submission(uuid, uuid, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.approve_submission(p_submission_id uuid, p_admin_id uuid, p_civilian_text text DEFAULT NULL::text) RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_sub RECORD;
  v_civilian TEXT;
BEGIN
  -- Get the submission
  SELECT * INTO v_sub FROM dict_submissions WHERE id = p_submission_id;
  
  IF v_sub IS NULL THEN
    RETURN 'Submission not found';
  END IF;
  
  -- Use admin override or user suggestion
  v_civilian := COALESCE(p_civilian_text, v_sub.suggested_civilian);
  
  IF v_civilian IS NULL THEN
    RETURN 'No civilian translation provided';
  END IF;
  
  -- Insert into appropriate dictionary table
  CASE v_sub.submission_type
    WHEN 'jargon' THEN
      INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category)
      VALUES (v_sub.military_term, v_civilian, v_sub.branch, v_sub.category);
      
    WHEN 'phrase' THEN
      INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category)
      VALUES (v_sub.military_term, v_civilian, v_sub.branch, v_sub.category);
      
    WHEN 'acronym' THEN
      INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category)
      VALUES (v_sub.military_term, v_civilian, v_sub.context_notes, v_sub.branch, v_sub.category);
      
    WHEN 'eval_phrase' THEN
      INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, performance_level, branch, category)
      VALUES (v_sub.military_term, v_civilian, 'mid', v_sub.branch, v_sub.category);
      
    ELSE
      -- For MOS and bullet_suggestion, manual handling needed
      NULL;
  END CASE;
  
  -- Mark as approved
  UPDATE dict_submissions
  SET status = 'approved',
      reviewed_by = p_admin_id,
      reviewed_at = NOW()
  WHERE id = p_submission_id;
  
  -- Mark any matching missing terms as resolved
  UPDATE dict_missing_terms_log
  SET resolved = true, resolved_at = NOW()
  WHERE LOWER(term) = LOWER(v_sub.military_term);
  
  RETURN 'Approved and added to dictionary';
END;
$$;


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    user_id,
    email,
    first_name,
    last_name,
    branch,
    paygrade,
    tier,
    subscription_tier,
    is_admin,
    onboarding_completed
  )
  VALUES (
    NEW.id,
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'branch', NULL),
    COALESCE(NEW.raw_user_meta_data->>'paygrade', NULL),
    'free',
    'free',
    false,
    false
  );
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in handle_new_user: %', SQLERRM;
  RETURN NEW;
END;
$$;


--
-- Name: increment_daily_usage(uuid, text, date, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.increment_daily_usage(p_user_id uuid, p_feature text, p_date date DEFAULT CURRENT_DATE, p_amount integer DEFAULT 1) RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  new_count INT;
BEGIN
  INSERT INTO daily_usage (user_id, feature, date, count)
  VALUES (p_user_id, p_feature, p_date, p_amount)
  ON CONFLICT (user_id, feature, date)
  DO UPDATE SET count = daily_usage.count + p_amount
  RETURNING count INTO new_count;

  RETURN new_count;
END;
$$;


--
-- Name: increment_federal_downloads(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.increment_federal_downloads(p_user_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO usage (user_id, federal_downloads)
  VALUES (p_user_id, 1)
  ON CONFLICT (user_id)
  DO UPDATE SET federal_downloads = usage.federal_downloads + 1;
END;
$$;


--
-- Name: increment_missing_term(text, text, uuid, character varying); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.increment_missing_term(p_term text, p_context text DEFAULT NULL::text, p_user_id uuid DEFAULT NULL::uuid, p_branch character varying DEFAULT 'general'::character varying) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Try to increment existing
  UPDATE dict_missing_terms_log
  SET hit_count = hit_count + 1,
      source_context = COALESCE(p_context, source_context)
  WHERE LOWER(term) = LOWER(p_term) AND resolved = false;
  
  -- If no match, insert new
  IF NOT FOUND THEN
    INSERT INTO dict_missing_terms_log (term, source_context, user_id, branch)
    VALUES (p_term, p_context, p_user_id, p_branch);
  END IF;
END;
$$;


--
-- Name: increment_private_downloads(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.increment_private_downloads(p_user_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO usage (user_id, private_downloads)
  VALUES (p_user_id, 1)
  ON CONFLICT (user_id)
  DO UPDATE SET private_downloads = usage.private_downloads + 1;
END;
$$;


--
-- Name: increment_usage_field(uuid, text, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.increment_usage_field(p_user_id uuid, p_field text, p_amount integer DEFAULT 1) RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $_$
DECLARE
  new_value INT;
BEGIN
  IF p_field NOT IN (
    'resumes_created', 'resumes_downloaded', 'cover_letters', 'job_matches',
    'eval_uploads', 'bullet_rewrites', 'ai_summaries', 'private_downloads',
    'federal_downloads', 'linkedin_generations', 'resume_imports'
  ) THEN
    RAISE EXCEPTION 'Invalid usage field: %', p_field;
  END IF;

  EXECUTE format(
    'INSERT INTO usage (user_id, %I) VALUES ($1, $2)
     ON CONFLICT (user_id)
     DO UPDATE SET %I = COALESCE(usage.%I, 0) + $2, updated_at = NOW()
     RETURNING %I',
    p_field, p_field, p_field, p_field
  ) INTO new_value USING p_user_id, p_amount;

  RETURN COALESCE(new_value, p_amount);
END;
$_$;


--
-- Name: increment_usage_tracking(uuid, text, timestamp with time zone, timestamp with time zone, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.increment_usage_tracking(p_user_id uuid, p_feature text, p_period_start timestamp with time zone, p_period_end timestamp with time zone, p_amount integer DEFAULT 1) RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  new_count INT;
BEGIN
  INSERT INTO usage_tracking (user_id, feature, period_start, period_end, count, updated_at)
  VALUES (p_user_id, p_feature, p_period_start, p_period_end, p_amount, NOW())
  ON CONFLICT (user_id, feature, period_start)
  DO UPDATE SET count = usage_tracking.count + p_amount, updated_at = NOW()
  RETURNING count INTO new_count;

  RETURN new_count;
END;
$$;


--
-- Name: sync_tier_columns(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.sync_tier_columns() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  IF NEW.tier IS DISTINCT FROM OLD.tier THEN
    NEW.subscription_tier := NEW.tier;
  ELSIF NEW.subscription_tier IS DISTINCT FROM OLD.subscription_tier THEN
    NEW.tier := NEW.subscription_tier;
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: update_job_applications_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_job_applications_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


--
-- Name: update_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


--
-- Name: upsert_ai_translation(text, text, text, text, text, uuid, text, text, text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.upsert_ai_translation(p_source_type text, p_military_term text, p_civilian_translation text, p_full_context text DEFAULT NULL::text, p_model_used text DEFAULT NULL::text, p_user_id uuid DEFAULT NULL::uuid, p_branch text DEFAULT NULL::text, p_target_industry text DEFAULT NULL::text, p_target_role text DEFAULT NULL::text, p_suggested_table text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_normalized TEXT;
  v_existing_id UUID;
  v_existing_count INTEGER;
BEGIN
  v_normalized := LOWER(TRIM(p_military_term));

  -- Check for existing pending/approved entry with same term
  SELECT id, occurrence_count INTO v_existing_id, v_existing_count
  FROM ai_generated_translations
  WHERE LOWER(TRIM(military_term)) = v_normalized
    AND status IN ('pending', 'approved')
  LIMIT 1;

  IF v_existing_id IS NOT NULL THEN
    -- Increment occurrence count
    UPDATE ai_generated_translations
    SET occurrence_count = v_existing_count + 1
    WHERE id = v_existing_id;
  ELSE
    -- Insert new record
    INSERT INTO ai_generated_translations (
      source_type, military_term, civilian_translation, full_context,
      model_used, user_id, branch, target_industry, target_role, suggested_table
    ) VALUES (
      p_source_type, v_normalized, p_civilian_translation, p_full_context,
      p_model_used, p_user_id, p_branch, p_target_industry, p_target_role, p_suggested_table
    );
  END IF;
END;
$$;


--
-- Name: upvote_submission(uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.upvote_submission(p_submission_id uuid, p_user_id uuid) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Try to insert upvote (will fail on duplicate)
  INSERT INTO dict_submission_upvotes (submission_id, user_id)
  VALUES (p_submission_id, p_user_id);
  
  -- Increment counter on submission
  UPDATE dict_submissions
  SET upvotes = upvotes + 1
  WHERE id = p_submission_id;
  
  RETURN true;
EXCEPTION
  WHEN unique_violation THEN
    RETURN false; -- already upvoted
END;
$$;


--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_
        -- Filter by action early - only get subscriptions interested in this action
        -- action_filter column can be: '*' (all), 'INSERT', 'UPDATE', or 'DELETE'
        and (subs.action_filter = '*' or subs.action_filter = action::text);

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
  res jsonb;
begin
  if type_::text = 'bytea' then
    return to_jsonb(val);
  end if;
  execute format('select to_jsonb(%L::'|| type_::text || ')', val) into res;
  return res;
end
$$;


--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS TABLE(wal jsonb, is_rls_enabled boolean, subscription_ids uuid[], errors text[], slot_changes_count bigint)
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
  WITH pub AS (
    SELECT
      concat_ws(
        ',',
        CASE WHEN bool_or(pubinsert) THEN 'insert' ELSE NULL END,
        CASE WHEN bool_or(pubupdate) THEN 'update' ELSE NULL END,
        CASE WHEN bool_or(pubdelete) THEN 'delete' ELSE NULL END
      ) AS w2j_actions,
      coalesce(
        string_agg(
          realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
          ','
        ) filter (WHERE ppt.tablename IS NOT NULL AND ppt.tablename NOT LIKE '% %'),
        ''
      ) AS w2j_add_tables
    FROM pg_publication pp
    LEFT JOIN pg_publication_tables ppt ON pp.pubname = ppt.pubname
    WHERE pp.pubname = publication
    GROUP BY pp.pubname
    LIMIT 1
  ),
  -- MATERIALIZED ensures pg_logical_slot_get_changes is called exactly once
  w2j AS MATERIALIZED (
    SELECT x.*, pub.w2j_add_tables
    FROM pub,
         pg_logical_slot_get_changes(
           slot_name, null, max_changes,
           'include-pk', 'true',
           'include-transaction', 'false',
           'include-timestamp', 'true',
           'include-type-oids', 'true',
           'format-version', '2',
           'actions', pub.w2j_actions,
           'add-tables', pub.w2j_add_tables
         ) x
  ),
  -- Count raw slot entries before apply_rls/subscription filter
  slot_count AS (
    SELECT count(*)::bigint AS cnt
    FROM w2j
    WHERE w2j.w2j_add_tables <> ''
  ),
  -- Apply RLS and filter as before
  rls_filtered AS (
    SELECT xyz.wal, xyz.is_rls_enabled, xyz.subscription_ids, xyz.errors
    FROM w2j,
         realtime.apply_rls(
           wal := w2j.data::jsonb,
           max_record_bytes := max_record_bytes
         ) xyz(wal, is_rls_enabled, subscription_ids, errors)
    WHERE w2j.w2j_add_tables <> ''
      AND xyz.subscription_ids[1] IS NOT NULL
  )
  -- Real rows with slot count attached
  SELECT rf.wal, rf.is_rls_enabled, rf.subscription_ids, rf.errors, sc.cnt
  FROM rls_filtered rf, slot_count sc

  UNION ALL

  -- Sentinel row: always returned when no real rows exist so Elixir can
  -- always read slot_changes_count. Identified by wal IS NULL.
  SELECT null, null, null, null, sc.cnt
  FROM slot_count sc
  WHERE NOT EXISTS (SELECT 1 FROM rls_filtered)
$$;


--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  generated_id uuid;
  final_payload jsonb;
BEGIN
  BEGIN
    -- Generate a new UUID for the id
    generated_id := gen_random_uuid();

    -- Check if payload has an 'id' key, if not, add the generated UUID
    IF payload ? 'id' THEN
      final_payload := payload;
    ELSE
      final_payload := jsonb_set(payload, '{id}', to_jsonb(generated_id));
    END IF;

    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (id, payload, event, topic, private, extension)
    VALUES (generated_id, final_payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


--
-- Name: allow_any_operation(text[]); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.allow_any_operation(expected_operations text[]) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  WITH current_operation AS (
    SELECT storage.operation() AS raw_operation
  ),
  normalized AS (
    SELECT CASE
      WHEN raw_operation LIKE 'storage.%' THEN substr(raw_operation, 9)
      ELSE raw_operation
    END AS current_operation
    FROM current_operation
  )
  SELECT EXISTS (
    SELECT 1
    FROM normalized n
    CROSS JOIN LATERAL unnest(expected_operations) AS expected_operation
    WHERE expected_operation IS NOT NULL
      AND expected_operation <> ''
      AND n.current_operation = CASE
        WHEN expected_operation LIKE 'storage.%' THEN substr(expected_operation, 9)
        ELSE expected_operation
      END
  );
$$;


--
-- Name: allow_only_operation(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.allow_only_operation(expected_operation text) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  WITH current_operation AS (
    SELECT storage.operation() AS raw_operation
  ),
  normalized AS (
    SELECT
      CASE
        WHEN raw_operation LIKE 'storage.%' THEN substr(raw_operation, 9)
        ELSE raw_operation
      END AS current_operation,
      CASE
        WHEN expected_operation LIKE 'storage.%' THEN substr(expected_operation, 9)
        ELSE expected_operation
      END AS requested_operation
    FROM current_operation
  )
  SELECT CASE
    WHEN requested_operation IS NULL OR requested_operation = '' THEN FALSE
    ELSE COALESCE(current_operation = requested_operation, FALSE)
  END
  FROM normalized;
$$;


--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Get the last path segment (the actual filename)
    SELECT _parts[array_length(_parts, 1)] INTO _filename;
    -- Extract extension: reverse, split on '.', then reverse again
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


--
-- Name: get_common_prefix(text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $$
SELECT CASE
    WHEN position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)) > 0
    THEN left(p_key, length(p_prefix) + position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)))
    ELSE NULL
END;
$$;


--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint)::bigint as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;

    -- Configuration
    v_is_asc BOOLEAN;
    v_prefix TEXT;
    v_start TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_is_asc := lower(coalesce(sort_order, 'asc')) = 'asc';
    v_prefix := coalesce(prefix_param, '');
    v_start := CASE WHEN coalesce(next_token, '') <> '' THEN next_token ELSE coalesce(start_after, '') END;
    v_file_batch_size := LEAST(GREATEST(max_keys * 2, 100), 1000);

    -- Calculate upper bound for prefix filtering (bytewise, using COLLATE "C")
    IF v_prefix = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix, 1) = delimiter_param THEN
        v_upper_bound := left(v_prefix, -1) || chr(ascii(delimiter_param) + 1);
    ELSE
        v_upper_bound := left(v_prefix, -1) || chr(ascii(right(v_prefix, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'AND o.name COLLATE "C" < $3 ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'AND o.name COLLATE "C" >= $3 ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- ========================================================================
    -- SEEK INITIALIZATION: Determine starting position
    -- ========================================================================
    IF v_start = '' THEN
        IF v_is_asc THEN
            v_next_seek := v_prefix;
        ELSE
            -- DESC without cursor: find the last item in range
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;

            IF v_next_seek IS NOT NULL THEN
                v_next_seek := v_next_seek || delimiter_param;
            ELSE
                RETURN;
            END IF;
        END IF;
    ELSE
        -- Cursor provided: determine if it refers to a folder or leaf
        IF EXISTS (
            SELECT 1 FROM storage.objects o
            WHERE o.bucket_id = _bucket_id
              AND o.name COLLATE "C" LIKE v_start || delimiter_param || '%'
            LIMIT 1
        ) THEN
            -- Cursor refers to a folder
            IF v_is_asc THEN
                v_next_seek := v_start || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_start || delimiter_param;
            END IF;
        ELSE
            -- Cursor refers to a leaf object
            IF v_is_asc THEN
                v_next_seek := v_start || delimiter_param;
            ELSE
                v_next_seek := v_start;
            END IF;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= max_keys;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(v_peek_name, v_prefix, delimiter_param);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Emit and skip to next folder (no heap access needed)
            name := rtrim(v_common_prefix, delimiter_param);
            id := NULL;
            updated_at := NULL;
            created_at := NULL;
            last_accessed_at := NULL;
            metadata := NULL;
            RETURN NEXT;
            v_count := v_count + 1;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := left(v_common_prefix, -1) || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_common_prefix;
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query USING _bucket_id, v_next_seek,
                CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix) ELSE v_prefix END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(v_current.name, v_prefix, delimiter_param);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := v_current.name;
                    EXIT;
                END IF;

                -- Emit file
                name := v_current.name;
                id := v_current.id;
                updated_at := v_current.updated_at;
                created_at := v_current.created_at;
                last_accessed_at := v_current.last_accessed_at;
                metadata := v_current.metadata;
                RETURN NEXT;
                v_count := v_count + 1;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := v_current.name || delimiter_param;
                ELSE
                    v_next_seek := v_current.name;
                END IF;

                EXIT WHEN v_count >= max_keys;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


--
-- Name: protect_delete(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.protect_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Check if storage.allow_delete_query is set to 'true'
    IF COALESCE(current_setting('storage.allow_delete_query', true), 'false') != 'true' THEN
        RAISE EXCEPTION 'Direct deletion from storage tables is not allowed. Use the Storage API instead.'
            USING HINT = 'This prevents accidental data loss from orphaned objects.',
                  ERRCODE = '42501';
    END IF;
    RETURN NULL;
END;
$$;


--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;
    v_delimiter CONSTANT TEXT := '/';

    -- Configuration
    v_limit INT;
    v_prefix TEXT;
    v_prefix_lower TEXT;
    v_is_asc BOOLEAN;
    v_order_by TEXT;
    v_sort_order TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;
    v_skipped INT := 0;
BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_limit := LEAST(coalesce(limits, 100), 1500);
    v_prefix := coalesce(prefix, '') || coalesce(search, '');
    v_prefix_lower := lower(v_prefix);
    v_is_asc := lower(coalesce(sortorder, 'asc')) = 'asc';
    v_file_batch_size := LEAST(GREATEST(v_limit * 2, 100), 1000);

    -- Validate sort column
    CASE lower(coalesce(sortcolumn, 'name'))
        WHEN 'name' THEN v_order_by := 'name';
        WHEN 'updated_at' THEN v_order_by := 'updated_at';
        WHEN 'created_at' THEN v_order_by := 'created_at';
        WHEN 'last_accessed_at' THEN v_order_by := 'last_accessed_at';
        ELSE v_order_by := 'name';
    END CASE;

    v_sort_order := CASE WHEN v_is_asc THEN 'asc' ELSE 'desc' END;

    -- ========================================================================
    -- NON-NAME SORTING: Use path_tokens approach (unchanged)
    -- ========================================================================
    IF v_order_by != 'name' THEN
        RETURN QUERY EXECUTE format(
            $sql$
            WITH folders AS (
                SELECT path_tokens[$1] AS folder
                FROM storage.objects
                WHERE objects.name ILIKE $2 || '%%'
                  AND bucket_id = $3
                  AND array_length(objects.path_tokens, 1) <> $1
                GROUP BY folder
                ORDER BY folder %s
            )
            (SELECT folder AS "name",
                   NULL::uuid AS id,
                   NULL::timestamptz AS updated_at,
                   NULL::timestamptz AS created_at,
                   NULL::timestamptz AS last_accessed_at,
                   NULL::jsonb AS metadata FROM folders)
            UNION ALL
            (SELECT path_tokens[$1] AS "name",
                   id, updated_at, created_at, last_accessed_at, metadata
             FROM storage.objects
             WHERE objects.name ILIKE $2 || '%%'
               AND bucket_id = $3
               AND array_length(objects.path_tokens, 1) = $1
             ORDER BY %I %s)
            LIMIT $4 OFFSET $5
            $sql$, v_sort_order, v_order_by, v_sort_order
        ) USING levels, v_prefix, bucketname, v_limit, offsets;
        RETURN;
    END IF;

    -- ========================================================================
    -- NAME SORTING: Hybrid skip-scan with batch optimization
    -- ========================================================================

    -- Calculate upper bound for prefix filtering
    IF v_prefix_lower = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix_lower, 1) = v_delimiter THEN
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(v_delimiter) + 1);
    ELSE
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(right(v_prefix_lower, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'AND lower(o.name) COLLATE "C" < $3 ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'AND lower(o.name) COLLATE "C" >= $3 ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- Initialize seek position
    IF v_is_asc THEN
        v_next_seek := v_prefix_lower;
    ELSE
        -- DESC: find the last item in range first (static SQL)
        IF v_upper_bound IS NOT NULL THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower AND lower(o.name) COLLATE "C" < v_upper_bound
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSIF v_prefix_lower <> '' THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSE
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        END IF;

        IF v_peek_name IS NOT NULL THEN
            v_next_seek := lower(v_peek_name) || v_delimiter;
        ELSE
            RETURN;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= v_limit;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek AND lower(o.name) COLLATE "C" < v_upper_bound
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix_lower <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(lower(v_peek_name), v_prefix_lower, v_delimiter);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Handle offset, emit if needed, skip to next folder
            IF v_skipped < offsets THEN
                v_skipped := v_skipped + 1;
            ELSE
                name := split_part(rtrim(storage.get_common_prefix(v_peek_name, v_prefix, v_delimiter), v_delimiter), v_delimiter, levels);
                id := NULL;
                updated_at := NULL;
                created_at := NULL;
                last_accessed_at := NULL;
                metadata := NULL;
                RETURN NEXT;
                v_count := v_count + 1;
            END IF;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := lower(left(v_common_prefix, -1)) || chr(ascii(v_delimiter) + 1);
            ELSE
                v_next_seek := lower(v_common_prefix);
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix_lower is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query
                USING bucketname, v_next_seek,
                    CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix_lower) ELSE v_prefix_lower END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(lower(v_current.name), v_prefix_lower, v_delimiter);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := lower(v_current.name);
                    EXIT;
                END IF;

                -- Handle offset skipping
                IF v_skipped < offsets THEN
                    v_skipped := v_skipped + 1;
                ELSE
                    -- Emit file
                    name := split_part(v_current.name, v_delimiter, levels);
                    id := v_current.id;
                    updated_at := v_current.updated_at;
                    created_at := v_current.created_at;
                    last_accessed_at := v_current.last_accessed_at;
                    metadata := v_current.metadata;
                    RETURN NEXT;
                    v_count := v_count + 1;
                END IF;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := lower(v_current.name) || v_delimiter;
                ELSE
                    v_next_seek := lower(v_current.name);
                END IF;

                EXIT WHEN v_count >= v_limit;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


--
-- Name: search_by_timestamp(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_cursor_op text;
    v_query text;
    v_prefix text;
BEGIN
    v_prefix := coalesce(p_prefix, '');

    IF p_sort_order = 'asc' THEN
        v_cursor_op := '>';
    ELSE
        v_cursor_op := '<';
    END IF;

    v_query := format($sql$
        WITH raw_objects AS (
            SELECT
                o.name AS obj_name,
                o.id AS obj_id,
                o.updated_at AS obj_updated_at,
                o.created_at AS obj_created_at,
                o.last_accessed_at AS obj_last_accessed_at,
                o.metadata AS obj_metadata,
                storage.get_common_prefix(o.name, $1, '/') AS common_prefix
            FROM storage.objects o
            WHERE o.bucket_id = $2
              AND o.name COLLATE "C" LIKE $1 || '%%'
        ),
        -- Aggregate common prefixes (folders)
        -- Both created_at and updated_at use MIN(obj_created_at) to match the old prefixes table behavior
        aggregated_prefixes AS (
            SELECT
                rtrim(common_prefix, '/') AS name,
                NULL::uuid AS id,
                MIN(obj_created_at) AS updated_at,
                MIN(obj_created_at) AS created_at,
                NULL::timestamptz AS last_accessed_at,
                NULL::jsonb AS metadata,
                TRUE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NOT NULL
            GROUP BY common_prefix
        ),
        leaf_objects AS (
            SELECT
                obj_name AS name,
                obj_id AS id,
                obj_updated_at AS updated_at,
                obj_created_at AS created_at,
                obj_last_accessed_at AS last_accessed_at,
                obj_metadata AS metadata,
                FALSE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NULL
        ),
        combined AS (
            SELECT * FROM aggregated_prefixes
            UNION ALL
            SELECT * FROM leaf_objects
        ),
        filtered AS (
            SELECT *
            FROM combined
            WHERE (
                $5 = ''
                OR ROW(
                    date_trunc('milliseconds', %I),
                    name COLLATE "C"
                ) %s ROW(
                    COALESCE(NULLIF($6, '')::timestamptz, 'epoch'::timestamptz),
                    $5
                )
            )
        )
        SELECT
            split_part(name, '/', $3) AS key,
            name,
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
        FROM filtered
        ORDER BY
            COALESCE(date_trunc('milliseconds', %I), 'epoch'::timestamptz) %s,
            name COLLATE "C" %s
        LIMIT $4
    $sql$,
        p_sort_column,
        v_cursor_op,
        p_sort_column,
        p_sort_order,
        p_sort_order
    );

    RETURN QUERY EXECUTE v_query
    USING v_prefix, p_bucket_id, p_level, p_limit, p_start_after, p_sort_column_after;
END;
$_$;


--
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $$
DECLARE
    v_sort_col text;
    v_sort_ord text;
    v_limit int;
BEGIN
    -- Cap limit to maximum of 1500 records
    v_limit := LEAST(coalesce(limits, 100), 1500);

    -- Validate and normalize sort_order
    v_sort_ord := lower(coalesce(sort_order, 'asc'));
    IF v_sort_ord NOT IN ('asc', 'desc') THEN
        v_sort_ord := 'asc';
    END IF;

    -- Validate and normalize sort_column
    v_sort_col := lower(coalesce(sort_column, 'name'));
    IF v_sort_col NOT IN ('name', 'updated_at', 'created_at') THEN
        v_sort_col := 'name';
    END IF;

    -- Route to appropriate implementation
    IF v_sort_col = 'name' THEN
        -- Use list_objects_with_delimiter for name sorting (most efficient: O(k * log n))
        RETURN QUERY
        SELECT
            split_part(l.name, '/', levels) AS key,
            l.name AS name,
            l.id,
            l.updated_at,
            l.created_at,
            l.last_accessed_at,
            l.metadata
        FROM storage.list_objects_with_delimiter(
            bucket_name,
            coalesce(prefix, ''),
            '/',
            v_limit,
            start_after,
            '',
            v_sort_ord
        ) l;
    ELSE
        -- Use aggregation approach for timestamp sorting
        -- Not efficient for large datasets but supports correct pagination
        RETURN QUERY SELECT * FROM storage.search_by_timestamp(
            prefix, bucket_name, v_limit, levels, start_after,
            v_sort_ord, v_sort_col, sort_column_after
        );
    END IF;
END;
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: custom_oauth_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.custom_oauth_providers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    provider_type text NOT NULL,
    identifier text NOT NULL,
    name text NOT NULL,
    client_id text NOT NULL,
    client_secret text NOT NULL,
    acceptable_client_ids text[] DEFAULT '{}'::text[] NOT NULL,
    scopes text[] DEFAULT '{}'::text[] NOT NULL,
    pkce_enabled boolean DEFAULT true NOT NULL,
    attribute_mapping jsonb DEFAULT '{}'::jsonb NOT NULL,
    authorization_params jsonb DEFAULT '{}'::jsonb NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    email_optional boolean DEFAULT false NOT NULL,
    issuer text,
    discovery_url text,
    skip_nonce_check boolean DEFAULT false NOT NULL,
    cached_discovery jsonb,
    discovery_cached_at timestamp with time zone,
    authorization_url text,
    token_url text,
    userinfo_url text,
    jwks_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT custom_oauth_providers_authorization_url_https CHECK (((authorization_url IS NULL) OR (authorization_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_authorization_url_length CHECK (((authorization_url IS NULL) OR (char_length(authorization_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_client_id_length CHECK (((char_length(client_id) >= 1) AND (char_length(client_id) <= 512))),
    CONSTRAINT custom_oauth_providers_discovery_url_length CHECK (((discovery_url IS NULL) OR (char_length(discovery_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_identifier_format CHECK ((identifier ~ '^[a-z0-9][a-z0-9:-]{0,48}[a-z0-9]$'::text)),
    CONSTRAINT custom_oauth_providers_issuer_length CHECK (((issuer IS NULL) OR ((char_length(issuer) >= 1) AND (char_length(issuer) <= 2048)))),
    CONSTRAINT custom_oauth_providers_jwks_uri_https CHECK (((jwks_uri IS NULL) OR (jwks_uri ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_jwks_uri_length CHECK (((jwks_uri IS NULL) OR (char_length(jwks_uri) <= 2048))),
    CONSTRAINT custom_oauth_providers_name_length CHECK (((char_length(name) >= 1) AND (char_length(name) <= 100))),
    CONSTRAINT custom_oauth_providers_oauth2_requires_endpoints CHECK (((provider_type <> 'oauth2'::text) OR ((authorization_url IS NOT NULL) AND (token_url IS NOT NULL) AND (userinfo_url IS NOT NULL)))),
    CONSTRAINT custom_oauth_providers_oidc_discovery_url_https CHECK (((provider_type <> 'oidc'::text) OR (discovery_url IS NULL) OR (discovery_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_issuer_https CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NULL) OR (issuer ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_requires_issuer CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NOT NULL))),
    CONSTRAINT custom_oauth_providers_provider_type_check CHECK ((provider_type = ANY (ARRAY['oauth2'::text, 'oidc'::text]))),
    CONSTRAINT custom_oauth_providers_token_url_https CHECK (((token_url IS NULL) OR (token_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_token_url_length CHECK (((token_url IS NULL) OR (char_length(token_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_userinfo_url_https CHECK (((userinfo_url IS NULL) OR (userinfo_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_userinfo_url_length CHECK (((userinfo_url IS NULL) OR (char_length(userinfo_url) <= 2048)))
);


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text,
    code_challenge_method auth.code_challenge_method,
    code_challenge text,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone,
    invite_token text,
    referrer text,
    oauth_client_state_id uuid,
    linking_target_id uuid,
    email_optional boolean DEFAULT false NOT NULL
);


--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.flow_state IS 'Stores metadata for all OAuth/SSO login flows';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid,
    last_webauthn_challenge_data jsonb
);


--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: COLUMN mfa_factors.last_webauthn_challenge_data; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.mfa_factors.last_webauthn_challenge_data IS 'Stores the latest WebAuthn challenge data including attestation/assertion for customer verification';


--
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_authorizations (
    id uuid NOT NULL,
    authorization_id text NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid,
    redirect_uri text NOT NULL,
    scope text NOT NULL,
    state text,
    resource text,
    code_challenge text,
    code_challenge_method auth.code_challenge_method,
    response_type auth.oauth_response_type DEFAULT 'code'::auth.oauth_response_type NOT NULL,
    status auth.oauth_authorization_status DEFAULT 'pending'::auth.oauth_authorization_status NOT NULL,
    authorization_code text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
    approved_at timestamp with time zone,
    nonce text,
    CONSTRAINT oauth_authorizations_authorization_code_length CHECK ((char_length(authorization_code) <= 255)),
    CONSTRAINT oauth_authorizations_code_challenge_length CHECK ((char_length(code_challenge) <= 128)),
    CONSTRAINT oauth_authorizations_expires_at_future CHECK ((expires_at > created_at)),
    CONSTRAINT oauth_authorizations_nonce_length CHECK ((char_length(nonce) <= 255)),
    CONSTRAINT oauth_authorizations_redirect_uri_length CHECK ((char_length(redirect_uri) <= 2048)),
    CONSTRAINT oauth_authorizations_resource_length CHECK ((char_length(resource) <= 2048)),
    CONSTRAINT oauth_authorizations_scope_length CHECK ((char_length(scope) <= 4096)),
    CONSTRAINT oauth_authorizations_state_length CHECK ((char_length(state) <= 4096))
);


--
-- Name: oauth_client_states; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_client_states (
    id uuid NOT NULL,
    provider_type text NOT NULL,
    code_verifier text,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: TABLE oauth_client_states; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.oauth_client_states IS 'Stores OAuth states for third-party provider authentication flows where Supabase acts as the OAuth client.';


--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_secret_hash text,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    client_type auth.oauth_client_type DEFAULT 'confidential'::auth.oauth_client_type NOT NULL,
    token_endpoint_auth_method text NOT NULL,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048)),
    CONSTRAINT oauth_clients_token_endpoint_auth_method_check CHECK ((token_endpoint_auth_method = ANY (ARRAY['client_secret_basic'::text, 'client_secret_post'::text, 'none'::text])))
);


--
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_consents (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    scopes text NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT oauth_consents_revoked_after_granted CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at))),
    CONSTRAINT oauth_consents_scopes_length CHECK ((char_length(scopes) <= 2048)),
    CONSTRAINT oauth_consents_scopes_not_empty CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))
);


--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: -
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: -
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text,
    oauth_client_id uuid,
    refresh_token_hmac_key text,
    refresh_token_counter bigint,
    scopes text,
    CONSTRAINT sessions_scopes_length CHECK ((char_length(scopes) <= 4096))
);


--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: COLUMN sessions.refresh_token_hmac_key; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sessions.refresh_token_hmac_key IS 'Holds a HMAC-SHA256 key used to sign refresh tokens for this session.';


--
-- Name: COLUMN sessions.refresh_token_counter; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sessions.refresh_token_counter IS 'Holds the ID (counter) of the last issued refresh token.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: webauthn_challenges; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.webauthn_challenges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    challenge_type text NOT NULL,
    session_data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    CONSTRAINT webauthn_challenges_challenge_type_check CHECK ((challenge_type = ANY (ARRAY['signup'::text, 'registration'::text, 'authentication'::text])))
);


--
-- Name: webauthn_credentials; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.webauthn_credentials (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    credential_id bytea NOT NULL,
    public_key bytea NOT NULL,
    attestation_type text DEFAULT ''::text NOT NULL,
    aaguid uuid,
    sign_count bigint DEFAULT 0 NOT NULL,
    transports jsonb DEFAULT '[]'::jsonb NOT NULL,
    backup_eligible boolean DEFAULT false NOT NULL,
    backed_up boolean DEFAULT false NOT NULL,
    friendly_name text DEFAULT ''::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    last_used_at timestamp with time zone
);


--
-- Name: abuse_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.abuse_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    ip_address character varying(64),
    action character varying(100),
    details jsonb,
    severity character varying(20),
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: activity_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activity_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    action text NOT NULL,
    details jsonb,
    ip_address text,
    user_agent text,
    created_at timestamp with time zone DEFAULT now(),
    ip_hash text DEFAULT ''::text
);


--
-- Name: dict_missing_terms_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dict_missing_terms_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    term text NOT NULL,
    source_context text,
    user_id uuid,
    branch character varying(10),
    hit_count integer DEFAULT 1,
    resolved boolean DEFAULT false,
    resolved_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    status text DEFAULT 'pending'::text NOT NULL,
    CONSTRAINT dict_missing_terms_log_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'added'::text, 'dismissed'::text, 'false_positive'::text])))
);


--
-- Name: dict_submissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dict_submissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    submission_type character varying(30) NOT NULL,
    military_term text NOT NULL,
    suggested_civilian text,
    branch character varying(10) DEFAULT 'general'::character varying,
    category character varying(50),
    context_notes text,
    status character varying(20) DEFAULT 'pending'::character varying,
    admin_notes text,
    reviewed_by uuid,
    reviewed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    upvotes integer DEFAULT 1,
    CONSTRAINT dict_submissions_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying, 'duplicate'::character varying])::text[]))),
    CONSTRAINT dict_submissions_submission_type_check CHECK (((submission_type)::text = ANY ((ARRAY['jargon'::character varying, 'phrase'::character varying, 'acronym'::character varying, 'mos'::character varying, 'eval_phrase'::character varying, 'bullet_suggestion'::character varying])::text[])))
);


--
-- Name: admin_dictionary_priorities; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.admin_dictionary_priorities WITH (security_invoker='true') AS
 SELECT 'missing_auto'::character varying AS source,
    dict_missing_terms_log.term,
    dict_missing_terms_log.source_context,
    dict_missing_terms_log.branch,
    dict_missing_terms_log.hit_count AS demand_score,
    dict_missing_terms_log.created_at
   FROM public.dict_missing_terms_log
  WHERE (dict_missing_terms_log.resolved = false)
UNION ALL
 SELECT dict_submissions.submission_type AS source,
    dict_submissions.military_term AS term,
    dict_submissions.context_notes AS source_context,
    dict_submissions.branch,
    dict_submissions.upvotes AS demand_score,
    dict_submissions.created_at
   FROM public.dict_submissions
  WHERE ((dict_submissions.status)::text = 'pending'::text)
  ORDER BY 5 DESC;


--
-- Name: admin_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    key character varying(100) NOT NULL,
    value jsonb,
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: affiliations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.affiliations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    organization character varying(200) NOT NULL,
    member_type character varying(50),
    start_year character varying(4),
    end_year character varying(4),
    is_current boolean DEFAULT false,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: ai_generated_translations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_generated_translations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    source_type text NOT NULL,
    military_term text NOT NULL,
    civilian_translation text NOT NULL,
    full_context text,
    model_used text,
    user_id uuid,
    branch text,
    target_industry text,
    target_role text,
    suggested_table text,
    status text DEFAULT 'pending'::text,
    approved_by uuid,
    approved_at timestamp with time zone,
    dict_table text,
    dict_entry_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    notes text,
    occurrence_count integer DEFAULT 1
);


--
-- Name: analysis_cache; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.analysis_cache (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cache_key character varying(64) NOT NULL,
    result jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    expires_at timestamp with time zone NOT NULL
);


--
-- Name: analytics_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.analytics_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    event_name text NOT NULL,
    properties jsonb DEFAULT '{}'::jsonb,
    session_id text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: api_usage; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.api_usage (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    endpoint character varying(100),
    tokens_used integer,
    model character varying(50),
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: awards; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.awards (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    name character varying(200) NOT NULL,
    issuer character varying(200),
    date_received character varying(20),
    description text,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: beta_codes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.beta_codes (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    code text NOT NULL,
    used boolean DEFAULT false,
    used_by uuid,
    used_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    revoked boolean DEFAULT false,
    revoked_at timestamp with time zone,
    revoked_reason text,
    activated_at timestamp with time zone,
    expires_at timestamp with time zone
);


--
-- Name: bullets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bullets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    experience_id uuid NOT NULL,
    original_text text,
    translated_text text,
    metrics jsonb DEFAULT '[]'::jsonb,
    skills jsonb DEFAULT '[]'::jsonb,
    source text DEFAULT 'manual'::text,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: certifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.certifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name text NOT NULL,
    issuing_organization text,
    issue_date text,
    expiration_date text,
    credential_id text,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    issuer character varying(200),
    date_obtained character varying(20)
);


--
-- Name: cover_letters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cover_letters (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    resume_id uuid,
    title text DEFAULT 'Untitled Cover Letter'::text NOT NULL,
    company_name text,
    job_title text,
    content text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    downloaded_at timestamp with time zone
);


--
-- Name: daily_usage; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.daily_usage (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    feature character varying(50) NOT NULL,
    count integer DEFAULT 0,
    date date DEFAULT CURRENT_DATE,
    resume_imports integer DEFAULT 0,
    ai_summaries integer DEFAULT 0
);


--
-- Name: dict_acronyms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dict_acronyms (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    acronym character varying(20) NOT NULL,
    full_term character varying(255) NOT NULL,
    civilian_explanation character varying(255),
    branch character varying(10) DEFAULT 'general'::character varying,
    category character varying(50),
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: dict_action_verbs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dict_action_verbs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    verb character varying(50) NOT NULL,
    category character varying(50) NOT NULL,
    strength character varying(20) DEFAULT 'medium'::character varying,
    avoid_in character varying(50),
    best_for text[],
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: dict_ats_keywords; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dict_ats_keywords (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    industry character varying(50) NOT NULL,
    role_type character varying(50) NOT NULL,
    keywords text[] NOT NULL,
    weight character varying(10) DEFAULT 'medium'::character varying,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: dict_bullet_patterns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dict_bullet_patterns (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    pattern_name character varying(100) NOT NULL,
    category character varying(50) NOT NULL,
    rank_tier character varying(20),
    pattern_template text NOT NULL,
    example_military text,
    example_output text,
    required_fields text[],
    optional_fields text[],
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: dict_cert_funding; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dict_cert_funding (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cert_keyword character varying(100) NOT NULL,
    funding_program_code character varying(20) NOT NULL,
    branch character varying(10),
    notes text,
    direct_link text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: dict_cover_letter_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dict_cover_letter_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    template_name character varying(100) NOT NULL,
    industry character varying(50) NOT NULL,
    role_type character varying(50),
    opening_paragraph text NOT NULL,
    body_paragraph_1 text NOT NULL,
    body_paragraph_2 text NOT NULL,
    closing_paragraph text NOT NULL,
    placeholders jsonb,
    notes text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: dict_eval_phrases; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dict_eval_phrases (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    eval_phrase text NOT NULL,
    civilian_translation text NOT NULL,
    eval_type character varying(20),
    performance_level character varying(20),
    category character varying(50),
    created_at timestamp with time zone DEFAULT now(),
    branch character varying(10) DEFAULT 'general'::character varying
);


--
-- Name: dict_funding_programs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dict_funding_programs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    program_name character varying(100) NOT NULL,
    program_code character varying(20),
    description text NOT NULL,
    eligibility text NOT NULL,
    branches text[],
    status_required character varying(30),
    website_url text,
    how_to_apply text,
    key_benefits text[],
    limitations text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: dict_gap_recommendations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dict_gap_recommendations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    gap_keyword character varying(100) NOT NULL,
    gap_category character varying(30) NOT NULL,
    recommendation_type character varying(20) NOT NULL,
    recommendation text NOT NULL,
    related_certs text[],
    related_skills text[],
    free_resource_url text,
    resource_name character varying(100),
    estimated_time character varying(50),
    estimated_cost character varying(50),
    veteran_discount boolean DEFAULT false,
    veteran_discount_notes text,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT dict_gap_recommendations_gap_category_check CHECK (((gap_category)::text = ANY ((ARRAY['certification'::character varying, 'tool'::character varying, 'platform'::character varying, 'methodology'::character varying, 'skill'::character varying, 'education'::character varying, 'clearance'::character varying, 'language'::character varying, 'soft_skill'::character varying])::text[]))),
    CONSTRAINT dict_gap_recommendations_recommendation_type_check CHECK (((recommendation_type)::text = ANY ((ARRAY['equivalent'::character varying, 'training'::character varying, 'add_skill'::character varying, 'quick_win'::character varying, 'long_term'::character varying])::text[])))
);


--
-- Name: dict_industry_framing; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dict_industry_framing (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    military_experience character varying(100) NOT NULL,
    target_industry character varying(50) NOT NULL,
    framed_description text NOT NULL,
    keywords text[],
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: dict_linkedin_keywords; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dict_linkedin_keywords (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    military_skill character varying(100) NOT NULL,
    linkedin_keywords text[] NOT NULL,
    industry character varying(50),
    priority character varying(10) DEFAULT 'medium'::character varying,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: dict_linkedin_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dict_linkedin_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    section character varying(50) NOT NULL,
    template_name character varying(100) NOT NULL,
    target_role character varying(100),
    target_industry character varying(50),
    template_text text NOT NULL,
    placeholders jsonb,
    tips text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: dict_military_jargon; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dict_military_jargon (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    military_term character varying(255) NOT NULL,
    civilian_equivalent character varying(255) NOT NULL,
    context character varying(50) DEFAULT 'general'::character varying,
    category character varying(50),
    example_military text,
    example_civilian text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: dict_mos_to_civilian; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dict_mos_to_civilian (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    branch character varying(10) NOT NULL,
    military_code character varying(20) NOT NULL,
    military_title character varying(100) NOT NULL,
    civilian_titles text[] NOT NULL,
    onet_codes text[],
    industries text[],
    key_skills text[],
    description text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: dict_onet_crosswalk; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dict_onet_crosswalk (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    svc text NOT NULL,
    moc text NOT NULL,
    moc_title text NOT NULL,
    onet_code text,
    onet_title text,
    soc_code text,
    soc_title text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: dict_phrase_translations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dict_phrase_translations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    military_phrase text NOT NULL,
    civilian_phrase text NOT NULL,
    branch character varying(10) DEFAULT 'general'::character varying,
    category character varying(50),
    context_notes text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: dict_professional_summaries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dict_professional_summaries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    template_name character varying(100) NOT NULL,
    rank_tier character varying(20) NOT NULL,
    target_industry character varying(50) NOT NULL,
    target_role character varying(100),
    template_text text NOT NULL,
    example_output text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: dict_quantification_helpers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dict_quantification_helpers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    vague_phrase text NOT NULL,
    quantified_alternatives text[] NOT NULL,
    category character varying(50),
    tips text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: dict_rank_equivalents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dict_rank_equivalents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    branch character varying(10) NOT NULL,
    paygrade character varying(5) NOT NULL,
    military_rank character varying(50) NOT NULL,
    civilian_equivalent character varying(100) NOT NULL,
    responsibility_level character varying(100),
    typical_team_size character varying(50),
    federal_gs_equivalent character varying(20),
    years_experience_typical character varying(20),
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: dict_resume_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dict_resume_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    template_name character varying(100) NOT NULL,
    template_type character varying(20) NOT NULL,
    description text,
    sections jsonb NOT NULL,
    formatting jsonb,
    ats_optimized boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: dict_soft_skills; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dict_soft_skills (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    military_context text NOT NULL,
    civilian_skill character varying(100) NOT NULL,
    civilian_description text NOT NULL,
    resume_phrase text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: dict_submission_upvotes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dict_submission_upvotes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    submission_id uuid,
    user_id uuid,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: education; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.education (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    school_name text,
    degree_type text,
    field_of_study text,
    graduation_date date,
    gpa text,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    graduation_month character varying(2),
    graduation_year character varying(4),
    location character varying(100),
    minor character varying(100),
    is_expected boolean DEFAULT false,
    credits_earned integer,
    relevant_coursework text[],
    start_month character varying(2),
    start_year character varying(4)
);


--
-- Name: email_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    email_type character varying(50),
    recipient_email text,
    subject text,
    status character varying(20) DEFAULT 'sent'::character varying,
    error_message text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: eval_uploads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.eval_uploads (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    file_name text,
    file_url text,
    file_type text,
    eval_type text,
    eval_date date,
    extracted_data jsonb,
    status text DEFAULT 'pending'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: experience; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.experience (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    job_title character varying(200),
    company_name character varying(200),
    department character varying(200),
    city character varying(100),
    state character varying(2),
    location character varying(200),
    start_date date,
    end_date date,
    is_current boolean DEFAULT false,
    description text,
    hours_per_week integer DEFAULT 40,
    salary character varying(50),
    grade_level character varying(20),
    supervisor_name character varying(100),
    supervisor_phone character varying(20),
    supervisor_can_contact boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    civilian_title character varying(200),
    organization character varying(200),
    military_title character varying(200),
    original_bullets text[],
    translated_bullets text[],
    employment_type character varying DEFAULT 'military'::character varying
);


--
-- Name: experience_bullets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.experience_bullets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    experience_id uuid,
    original_text text,
    translated_text text,
    status character varying(20) DEFAULT 'pending'::character varying,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: experiences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.experiences (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    job_title text,
    civilian_title text,
    organization text,
    location text,
    start_date text,
    end_date text,
    is_current boolean DEFAULT false,
    description text,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: federal_qualifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.federal_qualifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    category character varying(50) NOT NULL,
    skills text NOT NULL,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: job_applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_applications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    resume_id uuid,
    company_name text NOT NULL,
    job_title text NOT NULL,
    applied_date date DEFAULT CURRENT_DATE NOT NULL,
    status text DEFAULT 'applied'::text NOT NULL,
    notes text,
    salary_offered integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT job_applications_status_check CHECK ((status = ANY (ARRAY['applied'::text, 'callback'::text, 'interview'::text, 'offer'::text, 'rejected'::text, 'accepted'::text])))
);


--
-- Name: languages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.languages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    language character varying(50) NOT NULL,
    proficiency character varying(50),
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: organization_invites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organization_invites (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    org_id uuid NOT NULL,
    email text NOT NULL,
    role text DEFAULT 'member'::text NOT NULL,
    token text DEFAULT encode(extensions.gen_random_bytes(32), 'hex'::text) NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '7 days'::interval) NOT NULL,
    accepted_at timestamp with time zone,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT organization_invites_role_check CHECK ((role = ANY (ARRAY['admin'::text, 'member'::text])))
);


--
-- Name: organization_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organization_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    org_id uuid NOT NULL,
    user_id uuid NOT NULL,
    role text DEFAULT 'member'::text NOT NULL,
    invited_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT organization_members_role_check CHECK ((role = ANY (ARRAY['admin'::text, 'member'::text])))
);


--
-- Name: organizations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organizations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    logo_url text,
    primary_color text,
    contact_email text NOT NULL,
    plan text DEFAULT 'starter'::text NOT NULL,
    max_seats integer DEFAULT 25 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT organizations_plan_check CHECK ((plan = ANY (ARRAY['starter'::text, 'growth'::text, 'enterprise'::text])))
);


--
-- Name: page_views; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.page_views (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    path character varying(255) NOT NULL,
    user_id uuid,
    session_id character varying(100),
    referrer text,
    user_agent text,
    ip_hash character varying(64),
    country character varying(2),
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    email text,
    first_name text,
    last_name text,
    phone text,
    city text,
    state text,
    zip text,
    linkedin_url text,
    branch text,
    rank text,
    rating_mos text,
    specialty_codes jsonb DEFAULT '[]'::jsonb,
    years_of_service integer DEFAULT 0,
    service_start_date date,
    service_end_date date,
    certifications jsonb DEFAULT '[]'::jsonb,
    clearance text,
    education jsonb DEFAULT '[]'::jsonb,
    duty_stations jsonb DEFAULT '[]'::jsonb,
    key_achievements jsonb DEFAULT '[]'::jsonb,
    evals jsonb DEFAULT '[]'::jsonb,
    target_industry text,
    target_role text,
    target_salary text,
    willing_to_relocate boolean DEFAULT false,
    preferred_locations jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    paygrade text,
    professional_summary text,
    mos_rating text,
    security_clearance text,
    separation_date date,
    skillbridge_start date,
    skillbridge_end date,
    zip_code character varying(10),
    mos character varying(50),
    veterans_preference boolean DEFAULT false,
    citizenship character varying(50) DEFAULT 'USA'::character varying,
    federal_civilian_status character varying(50),
    tier character varying(20) DEFAULT 'free'::character varying,
    is_admin boolean DEFAULT false,
    onboarding_completed boolean DEFAULT false,
    skillbridge_opt_in boolean DEFAULT false,
    onboarding_step integer DEFAULT 0,
    eas_date date,
    career_interests jsonb,
    job_search_timeline text,
    job_search_status text,
    desired_salary_min integer,
    desired_salary_max integer,
    work_preference text,
    remote_preference text,
    relocation_preferences jsonb,
    skillbridge_interested boolean DEFAULT false,
    role character varying(20) DEFAULT 'user'::character varying,
    subscription_tier character varying(20) DEFAULT 'free'::character varying,
    suspended boolean DEFAULT false,
    suspended_at timestamp with time zone,
    suspended_reason text,
    plan text DEFAULT 'free'::text,
    plan_expires_at timestamp without time zone,
    last_login_at timestamp with time zone,
    onboarding_skipped boolean DEFAULT false,
    auth_method text,
    employer_sharing_opt_in boolean,
    marketing_opt_in boolean,
    opt_in_prompted_at timestamp with time zone,
    opt_in_dismiss_count integer DEFAULT 0,
    eval_uploads_bonus integer DEFAULT 0,
    opt_in_employer_sharing boolean,
    opt_in_marketing boolean,
    opt_in_employer_sharing_date timestamp with time zone,
    opt_in_marketing_date timestamp with time zone,
    opt_in_prompted_count integer DEFAULT 0,
    org_id uuid
);


--
-- Name: COLUMN profiles.auth_method; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.auth_method IS 'Last auth method used: password or otp';


--
-- Name: COLUMN profiles.employer_sharing_opt_in; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.employer_sharing_opt_in IS 'NULL=never asked, FALSE=declined, TRUE=opted in';


--
-- Name: COLUMN profiles.marketing_opt_in; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.marketing_opt_in IS 'NULL=never asked, FALSE=declined, TRUE=opted in';


--
-- Name: COLUMN profiles.opt_in_prompted_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.opt_in_prompted_at IS 'When the user was last shown the opt-in prompt';


--
-- Name: COLUMN profiles.opt_in_dismiss_count; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.opt_in_dismiss_count IS 'How many times user dismissed the opt-in prompt';


--
-- Name: COLUMN profiles.eval_uploads_bonus; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.eval_uploads_bonus IS 'Bonus eval upload credits from eval pack purchases';


--
-- Name: promo_codes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.promo_codes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(20) NOT NULL,
    discount_percent integer,
    applies_to character varying(20),
    max_uses integer,
    current_uses integer DEFAULT 0,
    expires_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT promo_codes_discount_percent_check CHECK (((discount_percent >= 1) AND (discount_percent <= 100)))
);


--
-- Name: promo_redemptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.promo_redemptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code_id uuid,
    user_id uuid,
    redeemed_at timestamp with time zone DEFAULT now()
);


--
-- Name: resume_education; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resume_education (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    resume_id uuid,
    education_id uuid,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: resume_experience; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resume_experience (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    resume_id uuid,
    experience_id uuid,
    is_selected boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: resume_federal_info; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resume_federal_info (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    resume_id uuid,
    announcement_number character varying(50),
    position_title character varying(200),
    series_grade character varying(50),
    citizenship character varying(50) DEFAULT 'USA'::character varying,
    veterans_preference boolean DEFAULT false,
    federal_civilian_status character varying(50) DEFAULT 'N/A'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: resume_skills; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resume_skills (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    resume_id uuid,
    skill character varying(100) NOT NULL,
    is_selected boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: resume_versions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resume_versions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    resume_id uuid NOT NULL,
    user_id uuid NOT NULL,
    version_name text NOT NULL,
    resume_data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: resumes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resumes (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    title text DEFAULT 'Untitled Resume'::text NOT NULL,
    type text DEFAULT 'civilian'::text,
    contact_info jsonb DEFAULT '{}'::jsonb,
    summary text,
    experience jsonb DEFAULT '[]'::jsonb,
    education jsonb DEFAULT '[]'::jsonb,
    skills jsonb DEFAULT '[]'::jsonb,
    certifications jsonb DEFAULT '[]'::jsonb,
    target_job_title text,
    target_job_description text,
    match_score integer,
    federal_series text,
    federal_grade text,
    federal_essays jsonb DEFAULT '[]'::jsonb,
    is_master boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    content jsonb DEFAULT '{}'::jsonb,
    name text,
    resume_type text DEFAULT 'private'::text,
    template text DEFAULT 'clean'::text,
    format character varying(20) DEFAULT 'private'::character varying,
    professional_summary text,
    has_been_downloaded boolean DEFAULT false,
    downloaded_at timestamp with time zone,
    key_achievements uuid[] DEFAULT '{}'::uuid[]
);


--
-- Name: skills; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.skills (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name text NOT NULL,
    category text,
    proficiency text,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subscriptions (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    status text DEFAULT 'free'::text,
    plan text DEFAULT 'free'::text,
    beta_code text,
    stripe_customer_id text,
    stripe_subscription_id text,
    activated_at timestamp with time zone,
    expires_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    started_at timestamp with time zone DEFAULT now(),
    stripe_payment_id text,
    tier character varying(20)
);


--
-- Name: training; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.training (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    name character varying(200) NOT NULL,
    provider character varying(200),
    date_completed character varying(20),
    hours integer,
    description text,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: usage; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usage (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    resumes_created integer DEFAULT 0,
    resumes_downloaded integer DEFAULT 0,
    cover_letters integer DEFAULT 0,
    job_matches integer DEFAULT 0,
    eval_uploads integer DEFAULT 0,
    bullet_rewrites integer DEFAULT 0,
    ai_summaries integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    private_downloads integer DEFAULT 0,
    federal_downloads integer DEFAULT 0,
    resume_imports integer DEFAULT 0
);


--
-- Name: usage_tracking; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usage_tracking (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    feature character varying(50) NOT NULL,
    count integer DEFAULT 0,
    period_start timestamp with time zone NOT NULL,
    period_end timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    resume_imports integer DEFAULT 0,
    ai_summaries integer DEFAULT 0,
    downloads integer DEFAULT 0
);


--
-- Name: user_feedback; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_feedback (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    type character varying(20),
    message text NOT NULL,
    page_url text,
    status character varying(20) DEFAULT 'new'::character varying,
    admin_notes text,
    created_at timestamp with time zone DEFAULT now(),
    email text,
    category text NOT NULL,
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT user_feedback_category_check CHECK ((category = ANY (ARRAY['bug'::text, 'feature'::text, 'general'::text])))
);


--
-- Name: v_cert_funding_complete; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.v_cert_funding_complete WITH (security_invoker='true') AS
 SELECT gr.gap_keyword AS certification,
    gr.gap_category,
    gr.recommendation_type,
    gr.recommendation,
    gr.estimated_cost AS retail_cost,
    gr.estimated_time,
    gr.free_resource_url,
    gr.veteran_discount,
    gr.veteran_discount_notes,
    cf.funding_program_code,
    fp.program_name,
    fp.status_required,
    cf.branch AS funding_branch,
    cf.notes AS funding_notes,
    cf.direct_link AS funding_direct_link,
    fp.website_url AS program_website,
    fp.how_to_apply
   FROM ((public.dict_gap_recommendations gr
     LEFT JOIN public.dict_cert_funding cf ON (((gr.gap_keyword)::text = (cf.cert_keyword)::text)))
     LEFT JOIN public.dict_funding_programs fp ON (((cf.funding_program_code)::text = (fp.program_code)::text)))
  ORDER BY gr.gap_keyword, cf.branch;


--
-- Name: volunteer_experience; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.volunteer_experience (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    organization character varying(200) NOT NULL,
    role character varying(200),
    location character varying(100),
    start_date date,
    end_date date,
    is_current boolean DEFAULT false,
    description text,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: waitlist; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.waitlist (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    branch text,
    role_type text,
    created_at timestamp without time zone DEFAULT now(),
    discord_feedback boolean DEFAULT false,
    first_name text DEFAULT ''::text NOT NULL,
    last_name text DEFAULT ''::text NOT NULL,
    linkedin_url text,
    eas_date date,
    phone text,
    target_industry text
);


--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    action_filter text DEFAULT '*'::text,
    CONSTRAINT subscription_action_filter_check CHECK ((action_filter = ANY (ARRAY['*'::text, 'INSERT'::text, 'UPDATE'::text, 'DELETE'::text])))
);


--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: -
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets_analytics (
    name text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: buckets_vectors; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets_vectors (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'VECTOR'::storage.buckettype NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: objects; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb,
    metadata jsonb
);


--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: vector_indexes; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.vector_indexes (
    id text DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    bucket_id text NOT NULL,
    data_type text NOT NULL,
    dimension integer NOT NULL,
    distance_metric text NOT NULL,
    metadata_configuration jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: custom_oauth_providers custom_oauth_providers_identifier_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_identifier_key UNIQUE (identifier);


--
-- Name: custom_oauth_providers custom_oauth_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id);


--
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_pkey PRIMARY KEY (id);


--
-- Name: oauth_client_states oauth_client_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_client_states
    ADD CONSTRAINT oauth_client_states_pkey PRIMARY KEY (id);


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: webauthn_challenges webauthn_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_pkey PRIMARY KEY (id);


--
-- Name: webauthn_credentials webauthn_credentials_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_pkey PRIMARY KEY (id);


--
-- Name: abuse_log abuse_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.abuse_log
    ADD CONSTRAINT abuse_log_pkey PRIMARY KEY (id);


--
-- Name: activity_log activity_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_log
    ADD CONSTRAINT activity_log_pkey PRIMARY KEY (id);


--
-- Name: admin_settings admin_settings_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_settings
    ADD CONSTRAINT admin_settings_key_key UNIQUE (key);


--
-- Name: admin_settings admin_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_settings
    ADD CONSTRAINT admin_settings_pkey PRIMARY KEY (id);


--
-- Name: affiliations affiliations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.affiliations
    ADD CONSTRAINT affiliations_pkey PRIMARY KEY (id);


--
-- Name: ai_generated_translations ai_generated_translations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_generated_translations
    ADD CONSTRAINT ai_generated_translations_pkey PRIMARY KEY (id);


--
-- Name: analysis_cache analysis_cache_cache_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analysis_cache
    ADD CONSTRAINT analysis_cache_cache_key_key UNIQUE (cache_key);


--
-- Name: analysis_cache analysis_cache_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analysis_cache
    ADD CONSTRAINT analysis_cache_pkey PRIMARY KEY (id);


--
-- Name: analytics_events analytics_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_events
    ADD CONSTRAINT analytics_events_pkey PRIMARY KEY (id);


--
-- Name: api_usage api_usage_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_usage
    ADD CONSTRAINT api_usage_pkey PRIMARY KEY (id);


--
-- Name: awards awards_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.awards
    ADD CONSTRAINT awards_pkey PRIMARY KEY (id);


--
-- Name: beta_codes beta_codes_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.beta_codes
    ADD CONSTRAINT beta_codes_code_key UNIQUE (code);


--
-- Name: beta_codes beta_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.beta_codes
    ADD CONSTRAINT beta_codes_pkey PRIMARY KEY (id);


--
-- Name: bullets bullets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bullets
    ADD CONSTRAINT bullets_pkey PRIMARY KEY (id);


--
-- Name: certifications certifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certifications
    ADD CONSTRAINT certifications_pkey PRIMARY KEY (id);


--
-- Name: cover_letters cover_letters_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cover_letters
    ADD CONSTRAINT cover_letters_pkey PRIMARY KEY (id);


--
-- Name: daily_usage daily_usage_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_usage
    ADD CONSTRAINT daily_usage_pkey PRIMARY KEY (id);


--
-- Name: daily_usage daily_usage_user_id_feature_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_usage
    ADD CONSTRAINT daily_usage_user_id_feature_date_key UNIQUE (user_id, feature, date);


--
-- Name: dict_acronyms dict_acronyms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dict_acronyms
    ADD CONSTRAINT dict_acronyms_pkey PRIMARY KEY (id);


--
-- Name: dict_action_verbs dict_action_verbs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dict_action_verbs
    ADD CONSTRAINT dict_action_verbs_pkey PRIMARY KEY (id);


--
-- Name: dict_action_verbs dict_action_verbs_verb_category_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dict_action_verbs
    ADD CONSTRAINT dict_action_verbs_verb_category_key UNIQUE (verb, category);


--
-- Name: dict_ats_keywords dict_ats_keywords_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dict_ats_keywords
    ADD CONSTRAINT dict_ats_keywords_pkey PRIMARY KEY (id);


--
-- Name: dict_bullet_patterns dict_bullet_patterns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dict_bullet_patterns
    ADD CONSTRAINT dict_bullet_patterns_pkey PRIMARY KEY (id);


--
-- Name: dict_cert_funding dict_cert_funding_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dict_cert_funding
    ADD CONSTRAINT dict_cert_funding_pkey PRIMARY KEY (id);


--
-- Name: dict_cover_letter_templates dict_cover_letter_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dict_cover_letter_templates
    ADD CONSTRAINT dict_cover_letter_templates_pkey PRIMARY KEY (id);


--
-- Name: dict_eval_phrases dict_eval_phrases_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dict_eval_phrases
    ADD CONSTRAINT dict_eval_phrases_pkey PRIMARY KEY (id);


--
-- Name: dict_funding_programs dict_funding_programs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dict_funding_programs
    ADD CONSTRAINT dict_funding_programs_pkey PRIMARY KEY (id);


--
-- Name: dict_gap_recommendations dict_gap_recommendations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dict_gap_recommendations
    ADD CONSTRAINT dict_gap_recommendations_pkey PRIMARY KEY (id);


--
-- Name: dict_industry_framing dict_industry_framing_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dict_industry_framing
    ADD CONSTRAINT dict_industry_framing_pkey PRIMARY KEY (id);


--
-- Name: dict_linkedin_keywords dict_linkedin_keywords_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dict_linkedin_keywords
    ADD CONSTRAINT dict_linkedin_keywords_pkey PRIMARY KEY (id);


--
-- Name: dict_linkedin_templates dict_linkedin_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dict_linkedin_templates
    ADD CONSTRAINT dict_linkedin_templates_pkey PRIMARY KEY (id);


--
-- Name: dict_military_jargon dict_military_jargon_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dict_military_jargon
    ADD CONSTRAINT dict_military_jargon_pkey PRIMARY KEY (id);


--
-- Name: dict_missing_terms_log dict_missing_terms_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dict_missing_terms_log
    ADD CONSTRAINT dict_missing_terms_log_pkey PRIMARY KEY (id);


--
-- Name: dict_mos_to_civilian dict_mos_to_civilian_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dict_mos_to_civilian
    ADD CONSTRAINT dict_mos_to_civilian_pkey PRIMARY KEY (id);


--
-- Name: dict_onet_crosswalk dict_onet_crosswalk_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dict_onet_crosswalk
    ADD CONSTRAINT dict_onet_crosswalk_pkey PRIMARY KEY (id);


--
-- Name: dict_phrase_translations dict_phrase_translations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dict_phrase_translations
    ADD CONSTRAINT dict_phrase_translations_pkey PRIMARY KEY (id);


--
-- Name: dict_professional_summaries dict_professional_summaries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dict_professional_summaries
    ADD CONSTRAINT dict_professional_summaries_pkey PRIMARY KEY (id);


--
-- Name: dict_quantification_helpers dict_quantification_helpers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dict_quantification_helpers
    ADD CONSTRAINT dict_quantification_helpers_pkey PRIMARY KEY (id);


--
-- Name: dict_rank_equivalents dict_rank_equivalents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dict_rank_equivalents
    ADD CONSTRAINT dict_rank_equivalents_pkey PRIMARY KEY (id);


--
-- Name: dict_resume_templates dict_resume_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dict_resume_templates
    ADD CONSTRAINT dict_resume_templates_pkey PRIMARY KEY (id);


--
-- Name: dict_soft_skills dict_soft_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dict_soft_skills
    ADD CONSTRAINT dict_soft_skills_pkey PRIMARY KEY (id);


--
-- Name: dict_submission_upvotes dict_submission_upvotes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dict_submission_upvotes
    ADD CONSTRAINT dict_submission_upvotes_pkey PRIMARY KEY (id);


--
-- Name: dict_submission_upvotes dict_submission_upvotes_submission_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dict_submission_upvotes
    ADD CONSTRAINT dict_submission_upvotes_submission_id_user_id_key UNIQUE (submission_id, user_id);


--
-- Name: dict_submissions dict_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dict_submissions
    ADD CONSTRAINT dict_submissions_pkey PRIMARY KEY (id);


--
-- Name: education education_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.education
    ADD CONSTRAINT education_pkey PRIMARY KEY (id);


--
-- Name: email_logs email_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_logs
    ADD CONSTRAINT email_logs_pkey PRIMARY KEY (id);


--
-- Name: eval_uploads eval_uploads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.eval_uploads
    ADD CONSTRAINT eval_uploads_pkey PRIMARY KEY (id);


--
-- Name: experience_bullets experience_bullets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.experience_bullets
    ADD CONSTRAINT experience_bullets_pkey PRIMARY KEY (id);


--
-- Name: experience experience_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.experience
    ADD CONSTRAINT experience_pkey PRIMARY KEY (id);


--
-- Name: experiences experiences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.experiences
    ADD CONSTRAINT experiences_pkey PRIMARY KEY (id);


--
-- Name: federal_qualifications federal_qualifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.federal_qualifications
    ADD CONSTRAINT federal_qualifications_pkey PRIMARY KEY (id);


--
-- Name: job_applications job_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_pkey PRIMARY KEY (id);


--
-- Name: languages languages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.languages
    ADD CONSTRAINT languages_pkey PRIMARY KEY (id);


--
-- Name: organization_invites organization_invites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_invites
    ADD CONSTRAINT organization_invites_pkey PRIMARY KEY (id);


--
-- Name: organization_invites organization_invites_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_invites
    ADD CONSTRAINT organization_invites_token_key UNIQUE (token);


--
-- Name: organization_members organization_members_org_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_members
    ADD CONSTRAINT organization_members_org_id_user_id_key UNIQUE (org_id, user_id);


--
-- Name: organization_members organization_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_members
    ADD CONSTRAINT organization_members_pkey PRIMARY KEY (id);


--
-- Name: organizations organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (id);


--
-- Name: organizations organizations_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_slug_key UNIQUE (slug);


--
-- Name: page_views page_views_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_views
    ADD CONSTRAINT page_views_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);


--
-- Name: promo_codes promo_codes_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promo_codes
    ADD CONSTRAINT promo_codes_code_key UNIQUE (code);


--
-- Name: promo_codes promo_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promo_codes
    ADD CONSTRAINT promo_codes_pkey PRIMARY KEY (id);


--
-- Name: promo_redemptions promo_redemptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promo_redemptions
    ADD CONSTRAINT promo_redemptions_pkey PRIMARY KEY (id);


--
-- Name: resume_education resume_education_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resume_education
    ADD CONSTRAINT resume_education_pkey PRIMARY KEY (id);


--
-- Name: resume_education resume_education_resume_id_education_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resume_education
    ADD CONSTRAINT resume_education_resume_id_education_id_key UNIQUE (resume_id, education_id);


--
-- Name: resume_experience resume_experience_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resume_experience
    ADD CONSTRAINT resume_experience_pkey PRIMARY KEY (id);


--
-- Name: resume_federal_info resume_federal_info_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resume_federal_info
    ADD CONSTRAINT resume_federal_info_pkey PRIMARY KEY (id);


--
-- Name: resume_federal_info resume_federal_info_resume_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resume_federal_info
    ADD CONSTRAINT resume_federal_info_resume_id_key UNIQUE (resume_id);


--
-- Name: resume_skills resume_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resume_skills
    ADD CONSTRAINT resume_skills_pkey PRIMARY KEY (id);


--
-- Name: resume_versions resume_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resume_versions
    ADD CONSTRAINT resume_versions_pkey PRIMARY KEY (id);


--
-- Name: resumes resumes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resumes
    ADD CONSTRAINT resumes_pkey PRIMARY KEY (id);


--
-- Name: skills skills_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_user_id_key UNIQUE (user_id);


--
-- Name: training training_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.training
    ADD CONSTRAINT training_pkey PRIMARY KEY (id);


--
-- Name: usage usage_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usage
    ADD CONSTRAINT usage_pkey PRIMARY KEY (id);


--
-- Name: usage_tracking usage_tracking_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usage_tracking
    ADD CONSTRAINT usage_tracking_pkey PRIMARY KEY (id);


--
-- Name: usage_tracking usage_tracking_user_id_feature_period_start_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usage_tracking
    ADD CONSTRAINT usage_tracking_user_id_feature_period_start_key UNIQUE (user_id, feature, period_start);


--
-- Name: usage usage_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usage
    ADD CONSTRAINT usage_user_id_key UNIQUE (user_id);


--
-- Name: user_feedback user_feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_feedback
    ADD CONSTRAINT user_feedback_pkey PRIMARY KEY (id);


--
-- Name: volunteer_experience volunteer_experience_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.volunteer_experience
    ADD CONSTRAINT volunteer_experience_pkey PRIMARY KEY (id);


--
-- Name: waitlist waitlist_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.waitlist
    ADD CONSTRAINT waitlist_email_key UNIQUE (email);


--
-- Name: waitlist waitlist_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.waitlist
    ADD CONSTRAINT waitlist_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: buckets_vectors buckets_vectors_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets_vectors
    ADD CONSTRAINT buckets_vectors_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: vector_indexes vector_indexes_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_pkey PRIMARY KEY (id);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: custom_oauth_providers_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX custom_oauth_providers_created_at_idx ON auth.custom_oauth_providers USING btree (created_at);


--
-- Name: custom_oauth_providers_enabled_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX custom_oauth_providers_enabled_idx ON auth.custom_oauth_providers USING btree (enabled);


--
-- Name: custom_oauth_providers_identifier_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX custom_oauth_providers_identifier_idx ON auth.custom_oauth_providers USING btree (identifier);


--
-- Name: custom_oauth_providers_provider_type_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX custom_oauth_providers_provider_type_idx ON auth.custom_oauth_providers USING btree (provider_type);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_oauth_client_states_created_at; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_oauth_client_states_created_at ON auth.oauth_client_states USING btree (created_at);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_auth_pending_exp_idx ON auth.oauth_authorizations USING btree (expires_at) WHERE (status = 'pending'::auth.oauth_authorization_status);


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_consents_active_client_idx ON auth.oauth_consents USING btree (client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_consents_active_user_client_idx ON auth.oauth_consents USING btree (user_id, client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_consents_user_order_idx ON auth.oauth_consents USING btree (user_id, granted_at DESC);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_oauth_client_id_idx ON auth.sessions USING btree (oauth_client_id);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: webauthn_challenges_expires_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX webauthn_challenges_expires_at_idx ON auth.webauthn_challenges USING btree (expires_at);


--
-- Name: webauthn_challenges_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX webauthn_challenges_user_id_idx ON auth.webauthn_challenges USING btree (user_id);


--
-- Name: webauthn_credentials_credential_id_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX webauthn_credentials_credential_id_key ON auth.webauthn_credentials USING btree (credential_id);


--
-- Name: webauthn_credentials_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX webauthn_credentials_user_id_idx ON auth.webauthn_credentials USING btree (user_id);


--
-- Name: bullets_experience_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX bullets_experience_id_idx ON public.bullets USING btree (experience_id);


--
-- Name: certifications_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX certifications_user_id_idx ON public.certifications USING btree (user_id);


--
-- Name: experiences_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX experiences_user_id_idx ON public.experiences USING btree (user_id);


--
-- Name: idx_abuse_log_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_abuse_log_user ON public.abuse_log USING btree (user_id, created_at);


--
-- Name: idx_acronym; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_acronym ON public.dict_acronyms USING btree (acronym);


--
-- Name: idx_acronym_ft; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_acronym_ft ON public.dict_acronyms USING gin (to_tsvector('english'::regconfig, (((acronym)::text || ' '::text) || (full_term)::text)));


--
-- Name: idx_activity_log_action; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_activity_log_action ON public.activity_log USING btree (action);


--
-- Name: idx_activity_log_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_activity_log_created_at ON public.activity_log USING btree (created_at);


--
-- Name: idx_activity_log_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_activity_log_user_id ON public.activity_log USING btree (user_id);


--
-- Name: idx_ai_translations_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ai_translations_created ON public.ai_generated_translations USING btree (created_at DESC);


--
-- Name: idx_ai_translations_occurrence; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ai_translations_occurrence ON public.ai_generated_translations USING btree (occurrence_count DESC);


--
-- Name: idx_ai_translations_source; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ai_translations_source ON public.ai_generated_translations USING btree (source_type);


--
-- Name: idx_ai_translations_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ai_translations_status ON public.ai_generated_translations USING btree (status);


--
-- Name: idx_ai_translations_term; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ai_translations_term ON public.ai_generated_translations USING btree (military_term);


--
-- Name: idx_analysis_cache_expires; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_analysis_cache_expires ON public.analysis_cache USING btree (expires_at);


--
-- Name: idx_analysis_cache_key; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_analysis_cache_key ON public.analysis_cache USING btree (cache_key);


--
-- Name: idx_analytics_events_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_analytics_events_created_at ON public.analytics_events USING btree (created_at DESC);


--
-- Name: idx_analytics_events_event_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_analytics_events_event_name ON public.analytics_events USING btree (event_name);


--
-- Name: idx_analytics_events_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_analytics_events_user_id ON public.analytics_events USING btree (user_id);


--
-- Name: idx_ats_industry; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ats_industry ON public.dict_ats_keywords USING btree (industry, role_type);


--
-- Name: idx_bp_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bp_category ON public.dict_bullet_patterns USING btree (category, rank_tier);


--
-- Name: idx_cert_funding_cert; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cert_funding_cert ON public.dict_cert_funding USING btree (cert_keyword);


--
-- Name: idx_cert_funding_program; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cert_funding_program ON public.dict_cert_funding USING btree (funding_program_code);


--
-- Name: idx_cl_industry; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cl_industry ON public.dict_cover_letter_templates USING btree (industry, role_type);


--
-- Name: idx_daily_usage_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_daily_usage_user ON public.daily_usage USING btree (user_id, date);


--
-- Name: idx_eval_ft; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_eval_ft ON public.dict_eval_phrases USING gin (to_tsvector('english'::regconfig, eval_phrase));


--
-- Name: idx_eval_phrase; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_eval_phrase ON public.dict_eval_phrases USING btree (eval_phrase);


--
-- Name: idx_eval_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_eval_type ON public.dict_eval_phrases USING btree (eval_type);


--
-- Name: idx_framing; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_framing ON public.dict_industry_framing USING btree (military_experience, target_industry);


--
-- Name: idx_framing_ft; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_framing_ft ON public.dict_industry_framing USING gin (to_tsvector('english'::regconfig, (military_experience)::text));


--
-- Name: idx_gap_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_gap_category ON public.dict_gap_recommendations USING btree (gap_category);


--
-- Name: idx_gap_keyword; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_gap_keyword ON public.dict_gap_recommendations USING btree (gap_keyword);


--
-- Name: idx_jargon_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_jargon_category ON public.dict_military_jargon USING btree (category);


--
-- Name: idx_jargon_context; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_jargon_context ON public.dict_military_jargon USING btree (context);


--
-- Name: idx_jargon_ft; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_jargon_ft ON public.dict_military_jargon USING gin (to_tsvector('english'::regconfig, (military_term)::text));


--
-- Name: idx_jargon_term; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_jargon_term ON public.dict_military_jargon USING btree (military_term);


--
-- Name: idx_job_applications_resume; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_job_applications_resume ON public.job_applications USING btree (resume_id);


--
-- Name: idx_job_applications_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_job_applications_status ON public.job_applications USING btree (user_id, status);


--
-- Name: idx_job_applications_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_job_applications_user_id ON public.job_applications USING btree (user_id, applied_date DESC);


--
-- Name: idx_linkedin_section; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_linkedin_section ON public.dict_linkedin_templates USING btree (section, target_industry);


--
-- Name: idx_lk_skill; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lk_skill ON public.dict_linkedin_keywords USING btree (military_skill);


--
-- Name: idx_missing_hits; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_missing_hits ON public.dict_missing_terms_log USING btree (hit_count DESC) WHERE (resolved = false);


--
-- Name: idx_missing_term; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_missing_term ON public.dict_missing_terms_log USING btree (term, resolved);


--
-- Name: idx_missing_terms_status_hits; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_missing_terms_status_hits ON public.dict_missing_terms_log USING btree (status, hit_count DESC);


--
-- Name: idx_mos_code; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_mos_code ON public.dict_mos_to_civilian USING btree (branch, military_code);


--
-- Name: idx_mos_ft; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_mos_ft ON public.dict_mos_to_civilian USING gin (to_tsvector('english'::regconfig, (((military_code)::text || ' '::text) || (military_title)::text)));


--
-- Name: idx_onet_crosswalk_moc; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_onet_crosswalk_moc ON public.dict_onet_crosswalk USING btree (moc);


--
-- Name: idx_onet_crosswalk_onet_code; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_onet_crosswalk_onet_code ON public.dict_onet_crosswalk USING btree (onet_code);


--
-- Name: idx_onet_crosswalk_svc; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_onet_crosswalk_svc ON public.dict_onet_crosswalk USING btree (svc);


--
-- Name: idx_onet_crosswalk_svc_moc; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_onet_crosswalk_svc_moc ON public.dict_onet_crosswalk USING btree (svc, moc);


--
-- Name: idx_org_invites_org_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_org_invites_org_id ON public.organization_invites USING btree (org_id);


--
-- Name: idx_org_invites_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_org_invites_token ON public.organization_invites USING btree (token);


--
-- Name: idx_org_members_org_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_org_members_org_id ON public.organization_members USING btree (org_id);


--
-- Name: idx_org_members_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_org_members_user_id ON public.organization_members USING btree (user_id);


--
-- Name: idx_page_views_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_page_views_created_at ON public.page_views USING btree (created_at);


--
-- Name: idx_page_views_path; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_page_views_path ON public.page_views USING btree (path);


--
-- Name: idx_page_views_session_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_page_views_session_id ON public.page_views USING btree (session_id);


--
-- Name: idx_phrase_ft; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_phrase_ft ON public.dict_phrase_translations USING gin (to_tsvector('english'::regconfig, military_phrase));


--
-- Name: idx_phrase_mil; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_phrase_mil ON public.dict_phrase_translations USING gin (to_tsvector('english'::regconfig, military_phrase));


--
-- Name: idx_profiles_last_login_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profiles_last_login_at ON public.profiles USING btree (last_login_at DESC NULLS LAST);


--
-- Name: idx_profiles_opt_in_prompted; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profiles_opt_in_prompted ON public.profiles USING btree (user_id) WHERE ((employer_sharing_opt_in IS NULL) AND (marketing_opt_in IS NULL));


--
-- Name: idx_profiles_org_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profiles_org_id ON public.profiles USING btree (org_id);


--
-- Name: idx_ps_tier; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ps_tier ON public.dict_professional_summaries USING btree (rank_tier, target_industry);


--
-- Name: idx_rank_branch; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_rank_branch ON public.dict_rank_equivalents USING btree (branch, paygrade);


--
-- Name: idx_resume_versions_resume_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_resume_versions_resume_id ON public.resume_versions USING btree (resume_id, created_at DESC);


--
-- Name: idx_resume_versions_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_resume_versions_user_id ON public.resume_versions USING btree (user_id);


--
-- Name: idx_submissions_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_submissions_status ON public.dict_submissions USING btree (status);


--
-- Name: idx_submissions_term; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_submissions_term ON public.dict_submissions USING gin (to_tsvector('english'::regconfig, military_term));


--
-- Name: idx_submissions_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_submissions_type ON public.dict_submissions USING btree (submission_type, status);


--
-- Name: idx_submissions_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_submissions_user ON public.dict_submissions USING btree (user_id);


--
-- Name: idx_subscriptions_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_subscriptions_user ON public.subscriptions USING btree (user_id, status);


--
-- Name: idx_usage_tracking_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_usage_tracking_user ON public.usage_tracking USING btree (user_id, feature);


--
-- Name: idx_user_feedback_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_feedback_created ON public.user_feedback USING btree (created_at DESC);


--
-- Name: idx_user_feedback_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_feedback_status ON public.user_feedback USING btree (status);


--
-- Name: idx_verb_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_verb_category ON public.dict_action_verbs USING btree (category);


--
-- Name: skills_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX skills_user_id_idx ON public.skills USING btree (user_id);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: subscription_subscription_id_entity_filters_action_filter_key; Type: INDEX; Schema: realtime; Owner: -
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_action_filter_key ON realtime.subscription USING btree (subscription_id, entity, filters, action_filter);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: buckets_analytics_unique_name_idx; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX buckets_analytics_unique_name_idx ON storage.buckets_analytics USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: idx_objects_bucket_id_name_lower; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_objects_bucket_id_name_lower ON storage.objects USING btree (bucket_id, lower(name) COLLATE "C");


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: vector_indexes_name_bucket_id_idx; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX vector_indexes_name_bucket_id_idx ON storage.vector_indexes USING btree (name, bucket_id);


--
-- Name: users on_auth_user_created; Type: TRIGGER; Schema: auth; Owner: -
--

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


--
-- Name: job_applications job_applications_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER job_applications_updated_at BEFORE UPDATE ON public.job_applications FOR EACH ROW EXECUTE FUNCTION public.update_job_applications_updated_at();


--
-- Name: profiles sync_tiers; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER sync_tiers BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.sync_tier_columns();


--
-- Name: cover_letters update_cover_letters_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_cover_letters_updated_at BEFORE UPDATE ON public.cover_letters FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: resumes update_resumes_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_resumes_updated_at BEFORE UPDATE ON public.resumes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: subscriptions update_subscriptions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: -
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- Name: buckets protect_buckets_delete; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER protect_buckets_delete BEFORE DELETE ON storage.buckets FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects protect_objects_delete; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER protect_objects_delete BEFORE DELETE ON storage.objects FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_oauth_client_id_fkey FOREIGN KEY (oauth_client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: webauthn_challenges webauthn_challenges_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: webauthn_credentials webauthn_credentials_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: abuse_log abuse_log_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.abuse_log
    ADD CONSTRAINT abuse_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(user_id);


--
-- Name: activity_log activity_log_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_log
    ADD CONSTRAINT activity_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(user_id);


--
-- Name: affiliations affiliations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.affiliations
    ADD CONSTRAINT affiliations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: ai_generated_translations ai_generated_translations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_generated_translations
    ADD CONSTRAINT ai_generated_translations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: analytics_events analytics_events_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_events
    ADD CONSTRAINT analytics_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: api_usage api_usage_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_usage
    ADD CONSTRAINT api_usage_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(user_id);


--
-- Name: awards awards_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.awards
    ADD CONSTRAINT awards_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: beta_codes beta_codes_used_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.beta_codes
    ADD CONSTRAINT beta_codes_used_by_fkey FOREIGN KEY (used_by) REFERENCES auth.users(id);


--
-- Name: bullets bullets_experience_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bullets
    ADD CONSTRAINT bullets_experience_id_fkey FOREIGN KEY (experience_id) REFERENCES public.experience(id) ON DELETE CASCADE;


--
-- Name: certifications certifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certifications
    ADD CONSTRAINT certifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: cover_letters cover_letters_resume_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cover_letters
    ADD CONSTRAINT cover_letters_resume_id_fkey FOREIGN KEY (resume_id) REFERENCES public.resumes(id) ON DELETE SET NULL;


--
-- Name: cover_letters cover_letters_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cover_letters
    ADD CONSTRAINT cover_letters_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: daily_usage daily_usage_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_usage
    ADD CONSTRAINT daily_usage_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(user_id);


--
-- Name: dict_missing_terms_log dict_missing_terms_log_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dict_missing_terms_log
    ADD CONSTRAINT dict_missing_terms_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;


--
-- Name: dict_submission_upvotes dict_submission_upvotes_submission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dict_submission_upvotes
    ADD CONSTRAINT dict_submission_upvotes_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.dict_submissions(id) ON DELETE CASCADE;


--
-- Name: dict_submission_upvotes dict_submission_upvotes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dict_submission_upvotes
    ADD CONSTRAINT dict_submission_upvotes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: dict_submissions dict_submissions_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dict_submissions
    ADD CONSTRAINT dict_submissions_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.profiles(id);


--
-- Name: dict_submissions dict_submissions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dict_submissions
    ADD CONSTRAINT dict_submissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;


--
-- Name: education education_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.education
    ADD CONSTRAINT education_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: email_logs email_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_logs
    ADD CONSTRAINT email_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(user_id);


--
-- Name: eval_uploads eval_uploads_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.eval_uploads
    ADD CONSTRAINT eval_uploads_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: experience_bullets experience_bullets_experience_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.experience_bullets
    ADD CONSTRAINT experience_bullets_experience_id_fkey FOREIGN KEY (experience_id) REFERENCES public.experience(id) ON DELETE CASCADE;


--
-- Name: experience experience_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.experience
    ADD CONSTRAINT experience_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: experiences experiences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.experiences
    ADD CONSTRAINT experiences_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: federal_qualifications federal_qualifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.federal_qualifications
    ADD CONSTRAINT federal_qualifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: job_applications job_applications_resume_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_resume_id_fkey FOREIGN KEY (resume_id) REFERENCES public.resumes(id) ON DELETE SET NULL;


--
-- Name: job_applications job_applications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: languages languages_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.languages
    ADD CONSTRAINT languages_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: organization_invites organization_invites_org_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_invites
    ADD CONSTRAINT organization_invites_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: organization_members organization_members_org_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_members
    ADD CONSTRAINT organization_members_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: organization_members organization_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_members
    ADD CONSTRAINT organization_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: page_views page_views_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_views
    ADD CONSTRAINT page_views_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(user_id);


--
-- Name: profiles profiles_org_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.organizations(id) ON DELETE SET NULL;


--
-- Name: profiles profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: promo_redemptions promo_redemptions_code_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promo_redemptions
    ADD CONSTRAINT promo_redemptions_code_id_fkey FOREIGN KEY (code_id) REFERENCES public.promo_codes(id);


--
-- Name: promo_redemptions promo_redemptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promo_redemptions
    ADD CONSTRAINT promo_redemptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(user_id);


--
-- Name: resume_education resume_education_education_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resume_education
    ADD CONSTRAINT resume_education_education_id_fkey FOREIGN KEY (education_id) REFERENCES public.education(id) ON DELETE CASCADE;


--
-- Name: resume_education resume_education_resume_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resume_education
    ADD CONSTRAINT resume_education_resume_id_fkey FOREIGN KEY (resume_id) REFERENCES public.resumes(id) ON DELETE CASCADE;


--
-- Name: resume_experience resume_experience_experience_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resume_experience
    ADD CONSTRAINT resume_experience_experience_id_fkey FOREIGN KEY (experience_id) REFERENCES public.experience(id) ON DELETE CASCADE;


--
-- Name: resume_experience resume_experience_resume_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resume_experience
    ADD CONSTRAINT resume_experience_resume_id_fkey FOREIGN KEY (resume_id) REFERENCES public.resumes(id) ON DELETE CASCADE;


--
-- Name: resume_federal_info resume_federal_info_resume_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resume_federal_info
    ADD CONSTRAINT resume_federal_info_resume_id_fkey FOREIGN KEY (resume_id) REFERENCES public.resumes(id) ON DELETE CASCADE;


--
-- Name: resume_skills resume_skills_resume_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resume_skills
    ADD CONSTRAINT resume_skills_resume_id_fkey FOREIGN KEY (resume_id) REFERENCES public.resumes(id) ON DELETE CASCADE;


--
-- Name: resume_versions resume_versions_resume_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resume_versions
    ADD CONSTRAINT resume_versions_resume_id_fkey FOREIGN KEY (resume_id) REFERENCES public.resumes(id) ON DELETE CASCADE;


--
-- Name: resume_versions resume_versions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resume_versions
    ADD CONSTRAINT resume_versions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: resumes resumes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resumes
    ADD CONSTRAINT resumes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: skills skills_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: subscriptions subscriptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: training training_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.training
    ADD CONSTRAINT training_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: usage_tracking usage_tracking_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usage_tracking
    ADD CONSTRAINT usage_tracking_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(user_id);


--
-- Name: usage usage_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usage
    ADD CONSTRAINT usage_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_feedback user_feedback_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_feedback
    ADD CONSTRAINT user_feedback_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: volunteer_experience volunteer_experience_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.volunteer_experience
    ADD CONSTRAINT volunteer_experience_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: vector_indexes vector_indexes_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets_vectors(id);


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: beta_codes Admins can manage beta codes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage beta codes" ON public.beta_codes TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));


--
-- Name: page_views Admins can read page views; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can read page views" ON public.page_views FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND ((profiles.role)::text = 'admin'::text)))));


--
-- Name: dict_missing_terms_log Admins can update missing terms; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update missing terms" ON public.dict_missing_terms_log FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));


--
-- Name: dict_submissions Admins can update submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update submissions" ON public.dict_submissions FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));


--
-- Name: dict_submissions Admins can view all submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all submissions" ON public.dict_submissions FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));


--
-- Name: dict_missing_terms_log Admins can view missing terms; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view missing terms" ON public.dict_missing_terms_log FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));


--
-- Name: user_feedback Admins full access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins full access" ON public.user_feedback USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND ((profiles.role)::text = 'admin'::text)))));


--
-- Name: admin_settings Admins only; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins only" ON public.admin_settings USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND ((profiles.role)::text = 'admin'::text)))));


--
-- Name: api_usage Admins only; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins only" ON public.api_usage USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND ((profiles.role)::text = 'admin'::text)))));


--
-- Name: email_logs Admins only; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins only" ON public.email_logs USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND ((profiles.role)::text = 'admin'::text)))));


--
-- Name: promo_codes Admins only; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins only" ON public.promo_codes USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND ((profiles.role)::text = 'admin'::text)))));


--
-- Name: promo_redemptions Admins only; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins only" ON public.promo_redemptions USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND ((profiles.role)::text = 'admin'::text)))));


--
-- Name: abuse_log Admins only abuse; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins only abuse" ON public.abuse_log USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND ((profiles.role)::text = 'admin'::text)))));


--
-- Name: waitlist Allow anonymous inserts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow anonymous inserts" ON public.waitlist FOR INSERT TO anon WITH CHECK (true);


--
-- Name: dict_onet_crosswalk Anyone can read onet crosswalk; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can read onet crosswalk" ON public.dict_onet_crosswalk FOR SELECT USING (true);


--
-- Name: dict_acronyms Authenticated read dict_acronyms; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated read dict_acronyms" ON public.dict_acronyms FOR SELECT TO authenticated USING (true);


--
-- Name: dict_action_verbs Authenticated read dict_action_verbs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated read dict_action_verbs" ON public.dict_action_verbs FOR SELECT TO authenticated USING (true);


--
-- Name: dict_ats_keywords Authenticated read dict_ats_keywords; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated read dict_ats_keywords" ON public.dict_ats_keywords FOR SELECT TO authenticated USING (true);


--
-- Name: dict_bullet_patterns Authenticated read dict_bullet_patterns; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated read dict_bullet_patterns" ON public.dict_bullet_patterns FOR SELECT TO authenticated USING (true);


--
-- Name: dict_cert_funding Authenticated read dict_cert_funding; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated read dict_cert_funding" ON public.dict_cert_funding FOR SELECT TO authenticated USING (true);


--
-- Name: dict_cover_letter_templates Authenticated read dict_cover_letter_templates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated read dict_cover_letter_templates" ON public.dict_cover_letter_templates FOR SELECT TO authenticated USING (true);


--
-- Name: dict_eval_phrases Authenticated read dict_eval_phrases; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated read dict_eval_phrases" ON public.dict_eval_phrases FOR SELECT TO authenticated USING (true);


--
-- Name: dict_funding_programs Authenticated read dict_funding_programs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated read dict_funding_programs" ON public.dict_funding_programs FOR SELECT TO authenticated USING (true);


--
-- Name: dict_gap_recommendations Authenticated read dict_gap_recommendations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated read dict_gap_recommendations" ON public.dict_gap_recommendations FOR SELECT TO authenticated USING (true);


--
-- Name: dict_linkedin_keywords Authenticated read dict_linkedin_keywords; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated read dict_linkedin_keywords" ON public.dict_linkedin_keywords FOR SELECT TO authenticated USING (true);


--
-- Name: dict_military_jargon Authenticated read dict_military_jargon; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated read dict_military_jargon" ON public.dict_military_jargon FOR SELECT TO authenticated USING (true);


--
-- Name: dict_mos_to_civilian Authenticated read dict_mos_to_civilian; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated read dict_mos_to_civilian" ON public.dict_mos_to_civilian FOR SELECT TO authenticated USING (true);


--
-- Name: dict_phrase_translations Authenticated read dict_phrase_translations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated read dict_phrase_translations" ON public.dict_phrase_translations FOR SELECT TO authenticated USING (true);


--
-- Name: dict_professional_summaries Authenticated read dict_professional_summaries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated read dict_professional_summaries" ON public.dict_professional_summaries FOR SELECT TO authenticated USING (true);


--
-- Name: dict_rank_equivalents Authenticated read dict_rank_equivalents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated read dict_rank_equivalents" ON public.dict_rank_equivalents FOR SELECT TO authenticated USING (true);


--
-- Name: user_feedback Authenticated users can insert feedback; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can insert feedback" ON public.user_feedback FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: page_views Authenticated users can insert page views; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can insert page views" ON public.page_views FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: beta_codes Authenticated users can redeem codes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can redeem codes" ON public.beta_codes FOR UPDATE USING (((auth.uid() IS NOT NULL) AND (used = false)));


--
-- Name: beta_codes Authenticated users can validate codes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can validate codes" ON public.beta_codes FOR SELECT TO authenticated USING (true);


--
-- Name: dict_acronyms Public read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read access" ON public.dict_acronyms FOR SELECT USING (true);


--
-- Name: dict_action_verbs Public read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read access" ON public.dict_action_verbs FOR SELECT USING (true);


--
-- Name: dict_ats_keywords Public read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read access" ON public.dict_ats_keywords FOR SELECT USING (true);


--
-- Name: dict_bullet_patterns Public read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read access" ON public.dict_bullet_patterns FOR SELECT USING (true);


--
-- Name: dict_cert_funding Public read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read access" ON public.dict_cert_funding FOR SELECT USING (true);


--
-- Name: dict_cover_letter_templates Public read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read access" ON public.dict_cover_letter_templates FOR SELECT USING (true);


--
-- Name: dict_eval_phrases Public read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read access" ON public.dict_eval_phrases FOR SELECT USING (true);


--
-- Name: dict_funding_programs Public read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read access" ON public.dict_funding_programs FOR SELECT USING (true);


--
-- Name: dict_gap_recommendations Public read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read access" ON public.dict_gap_recommendations FOR SELECT USING (true);


--
-- Name: dict_industry_framing Public read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read access" ON public.dict_industry_framing FOR SELECT USING (true);


--
-- Name: dict_linkedin_keywords Public read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read access" ON public.dict_linkedin_keywords FOR SELECT USING (true);


--
-- Name: dict_linkedin_templates Public read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read access" ON public.dict_linkedin_templates FOR SELECT USING (true);


--
-- Name: dict_military_jargon Public read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read access" ON public.dict_military_jargon FOR SELECT USING (true);


--
-- Name: dict_mos_to_civilian Public read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read access" ON public.dict_mos_to_civilian FOR SELECT USING (true);


--
-- Name: dict_phrase_translations Public read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read access" ON public.dict_phrase_translations FOR SELECT USING (true);


--
-- Name: dict_professional_summaries Public read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read access" ON public.dict_professional_summaries FOR SELECT USING (true);


--
-- Name: dict_quantification_helpers Public read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read access" ON public.dict_quantification_helpers FOR SELECT USING (true);


--
-- Name: dict_rank_equivalents Public read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read access" ON public.dict_rank_equivalents FOR SELECT USING (true);


--
-- Name: dict_resume_templates Public read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read access" ON public.dict_resume_templates FOR SELECT USING (true);


--
-- Name: dict_soft_skills Public read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read access" ON public.dict_soft_skills FOR SELECT USING (true);


--
-- Name: analytics_events Service role can read all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role can read all" ON public.analytics_events FOR SELECT USING ((auth.role() = 'service_role'::text));


--
-- Name: ai_generated_translations Service role full access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role full access" ON public.ai_generated_translations TO service_role USING (true) WITH CHECK (true);


--
-- Name: subscriptions Service role manages subscriptions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role manages subscriptions" ON public.subscriptions TO service_role USING (true) WITH CHECK (true);


--
-- Name: affiliations Users can delete own affiliations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own affiliations" ON public.affiliations FOR DELETE USING ((user_id = auth.uid()));


--
-- Name: job_applications Users can delete own applications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own applications" ON public.job_applications FOR DELETE USING ((user_id = auth.uid()));


--
-- Name: awards Users can delete own awards; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own awards" ON public.awards FOR DELETE USING ((user_id = auth.uid()));


--
-- Name: certifications Users can delete own certifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own certifications" ON public.certifications FOR DELETE USING ((user_id = auth.uid()));


--
-- Name: cover_letters Users can delete own cover letters; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own cover letters" ON public.cover_letters FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: education Users can delete own education; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own education" ON public.education FOR DELETE USING ((user_id = auth.uid()));


--
-- Name: experience Users can delete own experience; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own experience" ON public.experience FOR DELETE USING ((user_id = auth.uid()));


--
-- Name: experience_bullets Users can delete own experience bullets; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own experience bullets" ON public.experience_bullets FOR DELETE USING ((experience_id IN ( SELECT experience.id
   FROM public.experience
  WHERE (experience.user_id = auth.uid()))));


--
-- Name: federal_qualifications Users can delete own federal qualifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own federal qualifications" ON public.federal_qualifications FOR DELETE USING ((user_id = auth.uid()));


--
-- Name: languages Users can delete own languages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own languages" ON public.languages FOR DELETE USING ((user_id = auth.uid()));


--
-- Name: resume_education Users can delete own resume education; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own resume education" ON public.resume_education FOR DELETE USING ((resume_id IN ( SELECT resumes.id
   FROM public.resumes
  WHERE (resumes.user_id = auth.uid()))));


--
-- Name: resume_experience Users can delete own resume experience; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own resume experience" ON public.resume_experience FOR DELETE USING ((resume_id IN ( SELECT resumes.id
   FROM public.resumes
  WHERE (resumes.user_id = auth.uid()))));


--
-- Name: resume_federal_info Users can delete own resume federal info; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own resume federal info" ON public.resume_federal_info FOR DELETE USING ((resume_id IN ( SELECT resumes.id
   FROM public.resumes
  WHERE (resumes.user_id = auth.uid()))));


--
-- Name: resume_skills Users can delete own resume skills; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own resume skills" ON public.resume_skills FOR DELETE USING ((resume_id IN ( SELECT resumes.id
   FROM public.resumes
  WHERE (resumes.user_id = auth.uid()))));


--
-- Name: resumes Users can delete own resumes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own resumes" ON public.resumes FOR DELETE USING ((user_id = auth.uid()));


--
-- Name: skills Users can delete own skills; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own skills" ON public.skills FOR DELETE USING ((user_id = auth.uid()));


--
-- Name: training Users can delete own training; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own training" ON public.training FOR DELETE USING ((user_id = auth.uid()));


--
-- Name: resume_versions Users can delete own versions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own versions" ON public.resume_versions FOR DELETE USING ((user_id = auth.uid()));


--
-- Name: volunteer_experience Users can delete own volunteer experience; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own volunteer experience" ON public.volunteer_experience FOR DELETE USING ((user_id = auth.uid()));


--
-- Name: certifications Users can do everything with own certifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can do everything with own certifications" ON public.certifications TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: skills Users can do everything with own skills; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can do everything with own skills" ON public.skills TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: dict_missing_terms_log Users can insert missing terms; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert missing terms" ON public.dict_missing_terms_log FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: activity_log Users can insert own activity; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own activity" ON public.activity_log FOR INSERT WITH CHECK ((user_id = auth.uid()));


--
-- Name: affiliations Users can insert own affiliations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own affiliations" ON public.affiliations FOR INSERT WITH CHECK ((user_id = auth.uid()));


--
-- Name: job_applications Users can insert own applications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own applications" ON public.job_applications FOR INSERT WITH CHECK ((user_id = auth.uid()));


--
-- Name: awards Users can insert own awards; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own awards" ON public.awards FOR INSERT WITH CHECK ((user_id = auth.uid()));


--
-- Name: certifications Users can insert own certifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own certifications" ON public.certifications FOR INSERT WITH CHECK ((user_id = auth.uid()));


--
-- Name: cover_letters Users can insert own cover letters; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own cover letters" ON public.cover_letters FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: education Users can insert own education; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own education" ON public.education FOR INSERT WITH CHECK ((user_id = auth.uid()));


--
-- Name: analytics_events Users can insert own events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own events" ON public.analytics_events FOR INSERT WITH CHECK (((auth.uid() = user_id) OR (user_id IS NULL)));


--
-- Name: experience Users can insert own experience; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own experience" ON public.experience FOR INSERT WITH CHECK ((user_id = auth.uid()));


--
-- Name: experience_bullets Users can insert own experience bullets; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own experience bullets" ON public.experience_bullets FOR INSERT WITH CHECK ((experience_id IN ( SELECT experience.id
   FROM public.experience
  WHERE (experience.user_id = auth.uid()))));


--
-- Name: federal_qualifications Users can insert own federal qualifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own federal qualifications" ON public.federal_qualifications FOR INSERT WITH CHECK ((user_id = auth.uid()));


--
-- Name: languages Users can insert own languages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own languages" ON public.languages FOR INSERT WITH CHECK ((user_id = auth.uid()));


--
-- Name: resume_education Users can insert own resume education; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own resume education" ON public.resume_education FOR INSERT WITH CHECK ((resume_id IN ( SELECT resumes.id
   FROM public.resumes
  WHERE (resumes.user_id = auth.uid()))));


--
-- Name: resume_experience Users can insert own resume experience; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own resume experience" ON public.resume_experience FOR INSERT WITH CHECK ((resume_id IN ( SELECT resumes.id
   FROM public.resumes
  WHERE (resumes.user_id = auth.uid()))));


--
-- Name: resume_federal_info Users can insert own resume federal info; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own resume federal info" ON public.resume_federal_info FOR INSERT WITH CHECK ((resume_id IN ( SELECT resumes.id
   FROM public.resumes
  WHERE (resumes.user_id = auth.uid()))));


--
-- Name: resume_skills Users can insert own resume skills; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own resume skills" ON public.resume_skills FOR INSERT WITH CHECK ((resume_id IN ( SELECT resumes.id
   FROM public.resumes
  WHERE (resumes.user_id = auth.uid()))));


--
-- Name: resumes Users can insert own resumes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own resumes" ON public.resumes FOR INSERT WITH CHECK ((user_id = auth.uid()));


--
-- Name: skills Users can insert own skills; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own skills" ON public.skills FOR INSERT WITH CHECK ((user_id = auth.uid()));


--
-- Name: dict_submissions Users can insert own submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own submissions" ON public.dict_submissions FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: subscriptions Users can insert own subscription; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own subscription" ON public.subscriptions FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: training Users can insert own training; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own training" ON public.training FOR INSERT WITH CHECK ((user_id = auth.uid()));


--
-- Name: resume_versions Users can insert own versions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own versions" ON public.resume_versions FOR INSERT WITH CHECK ((user_id = auth.uid()));


--
-- Name: volunteer_experience Users can insert own volunteer experience; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own volunteer experience" ON public.volunteer_experience FOR INSERT WITH CHECK ((user_id = auth.uid()));


--
-- Name: dict_submissions Users can insert submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert submissions" ON public.dict_submissions FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: certifications Users can manage own certifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can manage own certifications" ON public.certifications USING ((auth.uid() = user_id));


--
-- Name: education Users can manage own education; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can manage own education" ON public.education USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: eval_uploads Users can manage own eval_uploads; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can manage own eval_uploads" ON public.eval_uploads USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: skills Users can manage own skills; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can manage own skills" ON public.skills USING ((auth.uid() = user_id));


--
-- Name: usage Users can manage own usage; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can manage own usage" ON public.usage USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: daily_usage Users can only access own daily_usage; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can only access own daily_usage" ON public.daily_usage USING ((auth.uid() = user_id));


--
-- Name: usage_tracking Users can only access own usage_tracking; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can only access own usage_tracking" ON public.usage_tracking USING ((auth.uid() = user_id));


--
-- Name: dict_missing_terms_log Users can read missing terms; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can read missing terms" ON public.dict_missing_terms_log FOR SELECT TO authenticated USING (true);


--
-- Name: job_applications Users can read own applications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can read own applications" ON public.job_applications FOR SELECT USING ((user_id = auth.uid()));


--
-- Name: dict_submissions Users can read own submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can read own submissions" ON public.dict_submissions FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: resume_versions Users can read own versions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can read own versions" ON public.resume_versions FOR SELECT USING ((user_id = auth.uid()));


--
-- Name: beta_codes Users can redeem beta codes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can redeem beta codes" ON public.beta_codes FOR UPDATE USING ((auth.uid() IS NOT NULL));


--
-- Name: dict_submission_upvotes Users can see upvotes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can see upvotes" ON public.dict_submission_upvotes FOR SELECT USING (true);


--
-- Name: user_feedback Users can submit feedback; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can submit feedback" ON public.user_feedback FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: affiliations Users can update own affiliations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own affiliations" ON public.affiliations FOR UPDATE USING ((user_id = auth.uid()));


--
-- Name: job_applications Users can update own applications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own applications" ON public.job_applications FOR UPDATE USING ((user_id = auth.uid())) WITH CHECK ((user_id = auth.uid()));


--
-- Name: awards Users can update own awards; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own awards" ON public.awards FOR UPDATE USING ((user_id = auth.uid()));


--
-- Name: certifications Users can update own certifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own certifications" ON public.certifications FOR UPDATE USING ((user_id = auth.uid()));


--
-- Name: cover_letters Users can update own cover letters; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own cover letters" ON public.cover_letters FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: education Users can update own education; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own education" ON public.education FOR UPDATE USING ((user_id = auth.uid()));


--
-- Name: experience Users can update own experience; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own experience" ON public.experience FOR UPDATE USING ((user_id = auth.uid()));


--
-- Name: experience_bullets Users can update own experience bullets; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own experience bullets" ON public.experience_bullets FOR UPDATE USING ((experience_id IN ( SELECT experience.id
   FROM public.experience
  WHERE (experience.user_id = auth.uid()))));


--
-- Name: federal_qualifications Users can update own federal qualifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own federal qualifications" ON public.federal_qualifications FOR UPDATE USING ((user_id = auth.uid()));


--
-- Name: languages Users can update own languages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own languages" ON public.languages FOR UPDATE USING ((user_id = auth.uid()));


--
-- Name: resume_education Users can update own resume education; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own resume education" ON public.resume_education FOR UPDATE USING ((resume_id IN ( SELECT resumes.id
   FROM public.resumes
  WHERE (resumes.user_id = auth.uid()))));


--
-- Name: resume_experience Users can update own resume experience; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own resume experience" ON public.resume_experience FOR UPDATE USING ((resume_id IN ( SELECT resumes.id
   FROM public.resumes
  WHERE (resumes.user_id = auth.uid()))));


--
-- Name: resume_federal_info Users can update own resume federal info; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own resume federal info" ON public.resume_federal_info FOR UPDATE USING ((resume_id IN ( SELECT resumes.id
   FROM public.resumes
  WHERE (resumes.user_id = auth.uid()))));


--
-- Name: resume_skills Users can update own resume skills; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own resume skills" ON public.resume_skills FOR UPDATE USING ((resume_id IN ( SELECT resumes.id
   FROM public.resumes
  WHERE (resumes.user_id = auth.uid()))));


--
-- Name: resumes Users can update own resumes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own resumes" ON public.resumes FOR UPDATE USING ((user_id = auth.uid()));


--
-- Name: skills Users can update own skills; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own skills" ON public.skills FOR UPDATE USING ((user_id = auth.uid()));


--
-- Name: training Users can update own training; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own training" ON public.training FOR UPDATE USING ((user_id = auth.uid()));


--
-- Name: volunteer_experience Users can update own volunteer experience; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own volunteer experience" ON public.volunteer_experience FOR UPDATE USING ((user_id = auth.uid()));


--
-- Name: dict_submission_upvotes Users can upvote; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can upvote" ON public.dict_submission_upvotes FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: affiliations Users can view own affiliations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own affiliations" ON public.affiliations FOR SELECT USING ((user_id = auth.uid()));


--
-- Name: awards Users can view own awards; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own awards" ON public.awards FOR SELECT USING ((user_id = auth.uid()));


--
-- Name: certifications Users can view own certifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own certifications" ON public.certifications FOR SELECT USING ((user_id = auth.uid()));


--
-- Name: cover_letters Users can view own cover letters; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own cover letters" ON public.cover_letters FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: daily_usage Users can view own daily usage; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own daily usage" ON public.daily_usage FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: education Users can view own education; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own education" ON public.education FOR SELECT USING ((user_id = auth.uid()));


--
-- Name: experience Users can view own experience; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own experience" ON public.experience FOR SELECT USING ((user_id = auth.uid()));


--
-- Name: experience_bullets Users can view own experience bullets; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own experience bullets" ON public.experience_bullets FOR SELECT USING ((experience_id IN ( SELECT experience.id
   FROM public.experience
  WHERE (experience.user_id = auth.uid()))));


--
-- Name: federal_qualifications Users can view own federal qualifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own federal qualifications" ON public.federal_qualifications FOR SELECT USING ((user_id = auth.uid()));


--
-- Name: user_feedback Users can view own feedback; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own feedback" ON public.user_feedback FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: languages Users can view own languages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own languages" ON public.languages FOR SELECT USING ((user_id = auth.uid()));


--
-- Name: resume_education Users can view own resume education; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own resume education" ON public.resume_education FOR SELECT USING ((resume_id IN ( SELECT resumes.id
   FROM public.resumes
  WHERE (resumes.user_id = auth.uid()))));


--
-- Name: resume_experience Users can view own resume experience; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own resume experience" ON public.resume_experience FOR SELECT USING ((resume_id IN ( SELECT resumes.id
   FROM public.resumes
  WHERE (resumes.user_id = auth.uid()))));


--
-- Name: resume_federal_info Users can view own resume federal info; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own resume federal info" ON public.resume_federal_info FOR SELECT USING ((resume_id IN ( SELECT resumes.id
   FROM public.resumes
  WHERE (resumes.user_id = auth.uid()))));


--
-- Name: resume_skills Users can view own resume skills; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own resume skills" ON public.resume_skills FOR SELECT USING ((resume_id IN ( SELECT resumes.id
   FROM public.resumes
  WHERE (resumes.user_id = auth.uid()))));


--
-- Name: resumes Users can view own resumes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own resumes" ON public.resumes FOR SELECT USING ((user_id = auth.uid()));


--
-- Name: skills Users can view own skills; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own skills" ON public.skills FOR SELECT USING ((user_id = auth.uid()));


--
-- Name: subscriptions Users can view own subscription; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own subscription" ON public.subscriptions FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: subscriptions Users can view own subscriptions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: training Users can view own training; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own training" ON public.training FOR SELECT USING ((user_id = auth.uid()));


--
-- Name: usage_tracking Users can view own usage; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own usage" ON public.usage_tracking FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: volunteer_experience Users can view own volunteer experience; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own volunteer experience" ON public.volunteer_experience FOR SELECT USING ((user_id = auth.uid()));


--
-- Name: dict_submissions Users can view their own submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own submissions" ON public.dict_submissions FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: abuse_log; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.abuse_log ENABLE ROW LEVEL SECURITY;

--
-- Name: activity_log; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

--
-- Name: admin_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: affiliations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.affiliations ENABLE ROW LEVEL SECURITY;

--
-- Name: ai_generated_translations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ai_generated_translations ENABLE ROW LEVEL SECURITY;

--
-- Name: analysis_cache; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.analysis_cache ENABLE ROW LEVEL SECURITY;

--
-- Name: analytics_events; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

--
-- Name: api_usage; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;

--
-- Name: awards; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;

--
-- Name: beta_codes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.beta_codes ENABLE ROW LEVEL SECURITY;

--
-- Name: bullets; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.bullets ENABLE ROW LEVEL SECURITY;

--
-- Name: certifications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

--
-- Name: cover_letters; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.cover_letters ENABLE ROW LEVEL SECURITY;

--
-- Name: daily_usage; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.daily_usage ENABLE ROW LEVEL SECURITY;

--
-- Name: dict_acronyms; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.dict_acronyms ENABLE ROW LEVEL SECURITY;

--
-- Name: dict_action_verbs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.dict_action_verbs ENABLE ROW LEVEL SECURITY;

--
-- Name: dict_ats_keywords; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.dict_ats_keywords ENABLE ROW LEVEL SECURITY;

--
-- Name: dict_bullet_patterns; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.dict_bullet_patterns ENABLE ROW LEVEL SECURITY;

--
-- Name: dict_cert_funding; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.dict_cert_funding ENABLE ROW LEVEL SECURITY;

--
-- Name: dict_cover_letter_templates; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.dict_cover_letter_templates ENABLE ROW LEVEL SECURITY;

--
-- Name: dict_eval_phrases; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.dict_eval_phrases ENABLE ROW LEVEL SECURITY;

--
-- Name: dict_funding_programs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.dict_funding_programs ENABLE ROW LEVEL SECURITY;

--
-- Name: dict_gap_recommendations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.dict_gap_recommendations ENABLE ROW LEVEL SECURITY;

--
-- Name: dict_industry_framing; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.dict_industry_framing ENABLE ROW LEVEL SECURITY;

--
-- Name: dict_linkedin_keywords; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.dict_linkedin_keywords ENABLE ROW LEVEL SECURITY;

--
-- Name: dict_linkedin_templates; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.dict_linkedin_templates ENABLE ROW LEVEL SECURITY;

--
-- Name: dict_military_jargon; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.dict_military_jargon ENABLE ROW LEVEL SECURITY;

--
-- Name: dict_missing_terms_log; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.dict_missing_terms_log ENABLE ROW LEVEL SECURITY;

--
-- Name: dict_mos_to_civilian; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.dict_mos_to_civilian ENABLE ROW LEVEL SECURITY;

--
-- Name: dict_onet_crosswalk; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.dict_onet_crosswalk ENABLE ROW LEVEL SECURITY;

--
-- Name: dict_phrase_translations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.dict_phrase_translations ENABLE ROW LEVEL SECURITY;

--
-- Name: dict_professional_summaries; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.dict_professional_summaries ENABLE ROW LEVEL SECURITY;

--
-- Name: dict_quantification_helpers; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.dict_quantification_helpers ENABLE ROW LEVEL SECURITY;

--
-- Name: dict_rank_equivalents; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.dict_rank_equivalents ENABLE ROW LEVEL SECURITY;

--
-- Name: dict_resume_templates; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.dict_resume_templates ENABLE ROW LEVEL SECURITY;

--
-- Name: dict_soft_skills; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.dict_soft_skills ENABLE ROW LEVEL SECURITY;

--
-- Name: dict_submission_upvotes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.dict_submission_upvotes ENABLE ROW LEVEL SECURITY;

--
-- Name: dict_submissions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.dict_submissions ENABLE ROW LEVEL SECURITY;

--
-- Name: education; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

--
-- Name: email_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: eval_uploads; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.eval_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: experience; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;

--
-- Name: experience_bullets; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.experience_bullets ENABLE ROW LEVEL SECURITY;

--
-- Name: experiences; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

--
-- Name: federal_qualifications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.federal_qualifications ENABLE ROW LEVEL SECURITY;

--
-- Name: job_applications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

--
-- Name: languages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;

--
-- Name: organization_members members_read_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY members_read_own ON public.organization_members FOR SELECT USING ((user_id = auth.uid()));


--
-- Name: organization_members org_admins_delete_members; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY org_admins_delete_members ON public.organization_members FOR DELETE USING ((EXISTS ( SELECT 1
   FROM public.organization_members om
  WHERE ((om.org_id = organization_members.org_id) AND (om.user_id = auth.uid()) AND (om.role = 'admin'::text)))));


--
-- Name: organization_members org_admins_insert_members; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY org_admins_insert_members ON public.organization_members FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.organization_members om
  WHERE ((om.org_id = organization_members.org_id) AND (om.user_id = auth.uid()) AND (om.role = 'admin'::text)))));


--
-- Name: organization_invites org_admins_manage_invites; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY org_admins_manage_invites ON public.organization_invites USING ((EXISTS ( SELECT 1
   FROM public.organization_members
  WHERE ((organization_members.org_id = organization_invites.org_id) AND (organization_members.user_id = auth.uid()) AND (organization_members.role = 'admin'::text)))));


--
-- Name: organization_members org_admins_read_members; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY org_admins_read_members ON public.organization_members FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.organization_members om
  WHERE ((om.org_id = organization_members.org_id) AND (om.user_id = auth.uid()) AND (om.role = 'admin'::text)))));


--
-- Name: organizations org_admins_read_own_org; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY org_admins_read_own_org ON public.organizations FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.organization_members
  WHERE ((organization_members.org_id = organizations.id) AND (organization_members.user_id = auth.uid()) AND (organization_members.role = 'admin'::text)))));


--
-- Name: organizations org_admins_update_own_org; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY org_admins_update_own_org ON public.organizations FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.organization_members
  WHERE ((organization_members.org_id = organizations.id) AND (organization_members.user_id = auth.uid()) AND (organization_members.role = 'admin'::text)))));


--
-- Name: organization_invites; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.organization_invites ENABLE ROW LEVEL SECURITY;

--
-- Name: organization_members; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

--
-- Name: organizations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

--
-- Name: page_views; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles profiles_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY profiles_delete ON public.profiles FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: profiles profiles_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY profiles_insert ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: profiles profiles_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY profiles_select ON public.profiles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: profiles profiles_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY profiles_update ON public.profiles FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: promo_codes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

--
-- Name: promo_redemptions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.promo_redemptions ENABLE ROW LEVEL SECURITY;

--
-- Name: organizations public_read_org_by_slug; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY public_read_org_by_slug ON public.organizations FOR SELECT USING (true);


--
-- Name: resume_education; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.resume_education ENABLE ROW LEVEL SECURITY;

--
-- Name: resume_experience; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.resume_experience ENABLE ROW LEVEL SECURITY;

--
-- Name: resume_federal_info; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.resume_federal_info ENABLE ROW LEVEL SECURITY;

--
-- Name: resume_skills; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.resume_skills ENABLE ROW LEVEL SECURITY;

--
-- Name: resume_versions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.resume_versions ENABLE ROW LEVEL SECURITY;

--
-- Name: resumes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

--
-- Name: skills; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

--
-- Name: subscriptions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

--
-- Name: training; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.training ENABLE ROW LEVEL SECURITY;

--
-- Name: usage; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.usage ENABLE ROW LEVEL SECURITY;

--
-- Name: usage_tracking; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

--
-- Name: user_feedback; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;

--
-- Name: volunteer_experience; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.volunteer_experience ENABLE ROW LEVEL SECURITY;

--
-- Name: waitlist; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: -
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_vectors; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets_vectors ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: vector_indexes; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.vector_indexes ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: -
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


--
-- PostgreSQL database dump complete
--

\unrestrict 4bYBvDcPudKqJnCSs8TOCIUAAXdIoZijnRXHHXXAQO1mnLjw7Ok8b8fn5FZK3Uc

