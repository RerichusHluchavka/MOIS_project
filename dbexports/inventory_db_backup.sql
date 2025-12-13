--
-- PostgreSQL database dump
--

\restrict az3hpcI02YWwBlrsr0YWDmbU4PqQG6SRyfUx2JMlOUAFp5XpF79loRDniH40Upd

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

CREATE TABLE public.items (
    item_id integer NOT NULL,
    name character varying(255) NOT NULL,
    unit character varying(50) NOT NULL,
    quantity integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.items OWNER TO admin;

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


ALTER TABLE public.items_item_id_seq OWNER TO admin;

--
-- Name: items_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.items_item_id_seq OWNED BY public.items.item_id;


--
-- Name: storage; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.storage (
    storage_id integer NOT NULL,
    storage_type character varying(255),
    sector character varying(255)
);


ALTER TABLE public.storage OWNER TO admin;

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


ALTER TABLE public.storage_storage_id_seq OWNER TO admin;

--
-- Name: storage_storage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.storage_storage_id_seq OWNED BY public.storage.storage_id;


--
-- Name: storing; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.storing (
    storage_id integer,
    item_id integer,
    volume integer,
    consumption_date date
);


ALTER TABLE public.storing OWNER TO admin;

--
-- Name: items item_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.items ALTER COLUMN item_id SET DEFAULT nextval('public.items_item_id_seq'::regclass);


--
-- Name: storage storage_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.storage ALTER COLUMN storage_id SET DEFAULT nextval('public.storage_storage_id_seq'::regclass);


--
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.items (item_id, name, unit, quantity) FROM stdin;
2	Chicken bones	kg	10
1	Rice	kg	1005
3	Wood	kg	50
4	Gravel	gddddddddd	0
\.


--
-- Data for Name: storage; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.storage (storage_id, storage_type, sector) FROM stdin;
\.


--
-- Data for Name: storing; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.storing (storage_id, item_id, volume, consumption_date) FROM stdin;
\.


--
-- Name: items_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.items_item_id_seq', 4, true);


--
-- Name: storage_storage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.storage_storage_id_seq', 1, false);


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
-- Name: storing storing_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.storing
    ADD CONSTRAINT storing_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(item_id);


--
-- Name: storing storing_storage_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.storing
    ADD CONSTRAINT storing_storage_id_fkey FOREIGN KEY (storage_id) REFERENCES public.storage(storage_id);


--
-- PostgreSQL database dump complete
--

\unrestrict az3hpcI02YWwBlrsr0YWDmbU4PqQG6SRyfUx2JMlOUAFp5XpF79loRDniH40Upd

