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
-- Name: items; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.items
(
    item_id         integer                NOT NULL,
    name            character varying(100) NOT NULL,
    unit            character varying(100),
    quantity        integer DEFAULT 0 NOT NULL
);

ALTER TABLE public.items
    OWNER TO admin;

--
-- Name: items_item_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.items_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE public.items_item_id_seq
    OWNER TO admin;

--
-- Name: items_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.items_item_id_seq OWNED BY public.items.item_id;

--
-- Name: storage; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.storage
(
    storage_id   integer NOT NULL,
    storage_type character varying(100),
    sector       character varying(20)
);

ALTER TABLE public.storage
    OWNER TO admin;

--
-- Name: storage_storage_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.storage_storage_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE public.storage_storage_id_seq
    OWNER TO admin;

--
-- Name: storage_storage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.storage_storage_id_seq OWNED BY public.storage.storage_id;

--
-- Name: storing; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.storing
(
    storage_id       integer NOT NULL,
    item_id          integer NOT NULL,
    volume           numeric NOT NULL,
    consumption_date date
);

ALTER TABLE public.storing
    OWNER TO admin;

--
-- Name: items item_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.items
    ALTER COLUMN item_id SET DEFAULT nextval('public.items_item_id_seq'::regclass);

--
-- Name: storage storage_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.storage
    ALTER COLUMN storage_id SET DEFAULT nextval('public.storage_storage_id_seq'::regclass);

--
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.items (item_id, name, unit, quantity)
VALUES (1, 'Brambory', 'kg', 20),
       (2, 'Cibule', 'kg', 5),
       (4, 'Mrkev', 'kg', 8),
       (5, 'Vejce', 'ks', 24),
       (6, 'Mléko', 'l', 6),
       (7, 'Mouka hladká', 'kg', 5),
       (8, 'Cukr krupice', 'kg', 3),
       (9, 'Sůl', 'kg', 2),
       (10, 'Vepřové maso', 'kg', 5),
       (11, 'Kuřecí prsa', 'kg', 4),
       (12, 'Hovězí maso', 'kg', 3),
       (13, 'Máslo', 'kg', 2),
       (14, 'Sýr Eidam', 'kg', 2),
       (16, 'Rajčata', 'kg', 3),
       (17, 'Rýže', 'kg', 4),
       (18, 'Těstoviny', 'kg', 4),
       (19, 'Olej slunečnicový', 'l', 2),
       (3, 'česnek', 'kg', 10),
       (20, 'Kečup', 'kg', 1),
       (21, 'Kuřecí maso', 'kg', 20),
       (22, 'Pepř', 'g', 20),
       (15, 'Paprika', 'kg', 3);

--
-- Data for Name: storage; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.storage (storage_id, storage_type, sector)
VALUES (1, 'Chladnička', 'A1'),
       (2, 'Chladnička', 'A2'),
       (3, 'Mrazák', 'B1'),
       (4, 'Mrazák', 'B2'),
       (5, 'Suchá spíž', 'C1'),
       (6, 'Suchá spíž', 'C2'),
       (7, 'Sklep - bedny', 'D1'),
       (8, 'Sklep - přepravky', 'D2'),
       (9, 'Regál - tekutiny', 'E1'),
       (10, 'Regál - koření', 'E2');

--
-- Data for Name: storing; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.storing (storage_id, item_id, volume, consumption_date)
VALUES (1, 6, 3, '2024-02-20'),
       (1, 14, 2, '2024-03-10'),
       (2, 10, 3, '2024-02-18'),
       (2, 11, 5, '2024-03-05'),
       (2, 16, 3, '2024-02-22'),
       (3, 10, 10, '2024-08-01'),
       (3, 11, 8, '2024-09-01'),
       (3, 12, 6, '2024-10-01'),
       (4, 1, 15, '2024-07-01'),
       (4, 4, 5, '2024-06-01'),
       (4, 13, 3, '2025-01-01'),
       (5, 7, 10, '2024-12-01'),
       (5, 8, 5, '2025-01-01'),
       (5, 18, 6, '2024-11-01'),
       (6, 19, 3, '2024-10-01'),
       (6, 20, 4, '2024-09-01'),
       (7, 1, 25, '2024-04-01'),
       (8, 3, 15, '2024-05-01'),
       (8, 4, 10, '2024-03-01'),
       (9, 6, 6, '2024-04-01'),
       (9, 19, 5, '2024-11-01'),
       (10, 9, 2, NULL),
       (1, 5, 17, '2024-02-28'),
       (4, 21, 200, '2024-02-28'),
       (3, 21, 196.5, '2024-02-28'),
       (2, 15, 2.8, '2024-02-25'),
       (7, 2, 7.3999999999999995, '2024-03-15'),
       (5, 17, 6.1000000000000005, '2025-03-01'),
       (1, 13, 0.9099999999999999, '2024-03-15'),
       (5, 9, 3.97, NULL),
       (4, 22, 175, '2024-02-28');

--
-- Name: items_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.items_item_id_seq', 22, true);

--
-- Name: storage_storage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.storage_storage_id_seq', 10, true);

--
-- Name: items items_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_pkey PRIMARY KEY (item_id);

--
-- Name: storage storage_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.storage
    ADD CONSTRAINT storage_pkey PRIMARY KEY (storage_id);

--
-- Name: storing storing_storage_id_item_id_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.storing
    ADD CONSTRAINT storing_storage_id_item_id_key UNIQUE (storage_id, item_id);

--
-- Name: storing storing_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.storing
    ADD CONSTRAINT storing_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items (item_id) ON DELETE CASCADE;

--
-- Name: storing storing_storage_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.storing
    ADD CONSTRAINT storing_storage_id_fkey FOREIGN KEY (storage_id) REFERENCES public.storage (storage_id) ON DELETE CASCADE;

--
-- PostgreSQL database dump complete
--