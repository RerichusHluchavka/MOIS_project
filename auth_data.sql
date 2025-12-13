--
-- PostgreSQL database dump
--

-- Dumped from database version 15.15 (Debian 15.15-1.pgdg13+1)
-- Dumped by pg_dump version 15.15 (Debian 15.15-1.pgdg13+1)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: users; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.users
(
    id       integer                NOT NULL,
    username character varying(50)  NOT NULL,
    password character varying(255) NOT NULL,
    role     character varying(50)  NOT NULL
);

ALTER TABLE public.users
    OWNER TO admin;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE public.users_id_seq
    OWNER TO admin;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;

--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);

--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.users (id, username, password, role)
VALUES (1, 'admin', '$2a$10$VQm8935aoOcb1u/WjI/miu21WTlhRHTOiF4gQxhA5AlbJwClTnXWS', 'admin'),
       (2, 'kitchen', '$2a$10$VQm8935aoOcb1u/WjI/miu21WTlhRHTOiF4gQxhA5AlbJwClTnXWS', 'kitchen'),
       (3, 'inventory', '$2a$10$/G5qD3LuEbROUGOOAbnRXeBfxsZ6qD43buum5AyZV3uMu8ua2SKJm', 'inventory'),
       (4, 'prison', '$2a$10$/G5qD3LuEbROUGOOAbnRXeBfxsZ6qD43buum5AyZV3uMu8ua2SKJm', 'prison');

--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.users_id_seq', 24, true);

--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);

--
-- PostgreSQL database dump complete
--