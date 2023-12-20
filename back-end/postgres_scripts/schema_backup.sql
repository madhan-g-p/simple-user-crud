--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2
-- Dumped by pg_dump version 15.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: users; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA users;


ALTER SCHEMA users OWNER TO postgres;

--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: user_data; Type: TABLE; Schema: users; Owner: postgres
--

CREATE TABLE users.user_data (
    id integer NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    mobile text NOT NULL,
    salted_password text NOT NULL,
    address text,
    profession text,
    user_role text DEFAULT 'user'::text NOT NULL,
    created_time timestamp without time zone DEFAULT timezone('UTC'::text, now()) NOT NULL,
    edited_time timestamp without time zone,
    uuid text DEFAULT public.uuid_generate_v4() NOT NULL
);


ALTER TABLE users.user_data OWNER TO postgres;

--
-- Name: user_data_id_seq; Type: SEQUENCE; Schema: users; Owner: postgres
--

ALTER TABLE users.user_data ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME users.user_data_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: user_data user_data_email_key; Type: CONSTRAINT; Schema: users; Owner: postgres
--

ALTER TABLE ONLY users.user_data
    ADD CONSTRAINT user_data_email_key UNIQUE (email);


--
-- Name: user_data user_data_mobile_key; Type: CONSTRAINT; Schema: users; Owner: postgres
--

ALTER TABLE ONLY users.user_data
    ADD CONSTRAINT user_data_mobile_key UNIQUE (mobile);


--
-- Name: user_data user_data_pkey; Type: CONSTRAINT; Schema: users; Owner: postgres
--

ALTER TABLE ONLY users.user_data
    ADD CONSTRAINT user_data_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

INSERT INTO users.user_data (first_name,last_name,email,mobile,salted_password,address,profession,user_role) 
            VALUES ('test','name','test@mail.com','1234567899', '$2a$12$Mz08ExpdnZv4sGNTpjJUrO6TpYyzDc1onqp4q0kBg0bNEjwZ.qxFm' ,'test address','manager','admin');