--
-- PostgreSQL database dump
--

\restrict rGKlpNbAVltdSMKMhVklJjfWjZ2cr2MFD5twahQvTeO1SB7GfwRydmgpyhIyXs0

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
-- Name: allergens; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.allergens (
    allergen_id integer NOT NULL,
    allergen_name character varying NOT NULL
);


ALTER TABLE public.allergens OWNER TO admin;

--
-- Name: allergens_allergen_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.allergens_allergen_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.allergens_allergen_id_seq OWNER TO admin;

--
-- Name: allergens_allergen_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.allergens_allergen_id_seq OWNED BY public.allergens.allergen_id;


--
-- Name: cells; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.cells (
    cell_id integer NOT NULL,
    cell_name character(1) NOT NULL
);


ALTER TABLE public.cells OWNER TO admin;

--
-- Name: cells_cell_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.cells_cell_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cells_cell_id_seq OWNER TO admin;

--
-- Name: cells_cell_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.cells_cell_id_seq OWNED BY public.cells.cell_id;


--
-- Name: prisoner_allergens; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.prisoner_allergens (
    prisoner_id integer NOT NULL,
    allergen_id integer NOT NULL,
    severity character varying NOT NULL
);


ALTER TABLE public.prisoner_allergens OWNER TO admin;

--
-- Name: prisoners; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.prisoners (
    prisoner_id integer NOT NULL,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    credits integer DEFAULT 0 NOT NULL,
    cell_id integer NOT NULL,
    entry_date date DEFAULT CURRENT_DATE NOT NULL,
    release_date date,
    danger_level integer NOT NULL,
    religion character varying
);


ALTER TABLE public.prisoners OWNER TO admin;

--
-- Name: prisoners_prisoner_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.prisoners_prisoner_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.prisoners_prisoner_id_seq OWNER TO admin;

--
-- Name: prisoners_prisoner_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.prisoners_prisoner_id_seq OWNED BY public.prisoners.prisoner_id;


--
-- Name: allergens allergen_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.allergens ALTER COLUMN allergen_id SET DEFAULT nextval('public.allergens_allergen_id_seq'::regclass);


--
-- Name: cells cell_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.cells ALTER COLUMN cell_id SET DEFAULT nextval('public.cells_cell_id_seq'::regclass);


--
-- Name: prisoners prisoner_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.prisoners ALTER COLUMN prisoner_id SET DEFAULT nextval('public.prisoners_prisoner_id_seq'::regclass);


--
-- Data for Name: allergens; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.allergens (allergen_id, allergen_name) FROM stdin;
1	Peanuts
2	Milk
3	Gluten
4	Peanuts
5	Milk
6	Gluten
7	Soy
8	Eggs
9	Fish
\.


--
-- Data for Name: cells; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.cells (cell_id, cell_name) FROM stdin;
1	A
2	B
3	C
4	D
5	E
6	F
\.


--
-- Data for Name: prisoner_allergens; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.prisoner_allergens (prisoner_id, allergen_id, severity) FROM stdin;
1	1	Medium
2	1	Low
3	1	High
4	1	Medium
5	1	Low
6	1	High
7	1	Medium
8	1	Low
9	1	High
10	1	Medium
11	1	Low
12	1	High
13	1	Medium
14	1	Low
15	1	High
16	1	Medium
17	1	Low
18	1	High
19	1	Medium
20	1	Low
21	1	High
22	1	Medium
23	1	Low
24	1	High
25	1	Medium
26	1	Low
27	1	High
28	1	Medium
29	1	Low
30	1	High
31	1	Medium
32	1	Low
33	1	High
34	1	Medium
35	1	Low
36	1	High
37	1	Medium
38	1	Low
39	1	High
40	1	Medium
41	1	Low
42	1	High
1	2	Medium
2	2	Low
3	2	High
4	2	Medium
5	2	Low
6	2	High
7	2	Medium
8	2	Low
9	2	High
10	2	Medium
11	2	Low
12	2	High
13	2	Medium
14	2	Low
15	2	High
16	2	Medium
17	2	Low
18	2	High
19	2	Medium
20	2	Low
21	2	High
22	2	Medium
23	2	Low
24	2	High
25	2	Medium
26	2	Low
27	2	High
28	2	Medium
29	2	Low
30	2	High
31	2	Medium
32	2	Low
33	2	High
34	2	Medium
35	2	Low
36	2	High
37	2	Medium
38	2	Low
39	2	High
40	2	Medium
41	2	Low
42	2	High
1	3	Medium
2	3	Low
3	3	High
4	3	Medium
5	3	Low
6	3	High
7	3	Medium
8	3	Low
9	3	High
10	3	Medium
11	3	Low
12	3	High
13	3	Medium
14	3	Low
15	3	High
16	3	Medium
17	3	Low
18	3	High
19	3	Medium
20	3	Low
21	3	High
22	3	Medium
23	3	Low
24	3	High
25	3	Medium
26	3	Low
27	3	High
28	3	Medium
29	3	Low
30	3	High
31	3	Medium
32	3	Low
33	3	High
34	3	Medium
35	3	Low
36	3	High
37	3	Medium
38	3	Low
39	3	High
40	3	Medium
41	3	Low
42	3	High
\.


--
-- Data for Name: prisoners; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.prisoners (prisoner_id, first_name, last_name, credits, cell_id, entry_date, release_date, danger_level, religion) FROM stdin;
1	John	Smith	120	1	2025-12-09	\N	3	Christian
2	Mike	Brown	80	2	2025-12-09	\N	2	Atheist
3	Ahmed	Ali	200	3	2025-12-09	\N	4	Muslim
4	David	Clark	50	4	2025-12-09	\N	1	Jewish
5	Lukas	Novak	30	5	2025-12-09	\N	5	Atheist
6	Peter	White	75	6	2025-12-09	\N	2	Christian
7	Karel	Dvorak	90	1	2025-12-09	\N	3	Atheist
8	Marek	Svoboda	110	2	2025-12-09	\N	4	Christian
9	Tomas	Král	60	3	2025-12-09	\N	2	Christian
10	Roman	Horak	45	4	2025-12-09	\N	1	Atheist
11	Ali	Hassan	150	5	2025-12-09	\N	4	Muslim
12	Omar	Farouk	210	6	2025-12-09	\N	5	Muslim
13	Jan	Prochazka	20	1	2025-12-09	\N	1	Christian
14	Martin	Kolar	55	2	2025-12-09	\N	2	Atheist
15	Ondrej	Blaha	85	3	2025-12-09	\N	3	Christian
16	Radek	Urban	130	4	2025-12-09	\N	4	Atheist
17	Ivan	Petrov	170	5	2025-12-09	\N	5	Orthodox
18	Sergey	Ivanov	190	6	2025-12-09	\N	4	Orthodox
19	Adam	Green	65	1	2025-12-09	\N	2	Jewish
20	Noah	Levi	140	2	2025-12-09	\N	3	Jewish
21	Ethan	Cohen	90	3	2025-12-09	\N	2	Jewish
22	Samuel	Gold	110	4	2025-12-09	\N	3	Jewish
23	Mohammed	Saleh	220	5	2025-12-09	\N	5	Muslim
24	Yusuf	Khan	175	6	2025-12-09	\N	4	Muslim
25	Pavel	Maly	40	1	2025-12-09	\N	1	Atheist
26	Jiri	Sedlak	70	2	2025-12-09	\N	2	Christian
27	Vaclav	Fiala	95	3	2025-12-09	\N	3	Christian
28	Zdenek	Koubek	160	4	2025-12-09	\N	5	Atheist
29	Daniel	King	85	5	2025-12-09	\N	2	Christian
30	Robert	Hill	100	6	2025-12-09	\N	3	Christian
31	Chris	Moore	60	1	2025-12-09	\N	2	Atheist
32	Brian	Taylor	45	2	2025-12-09	\N	1	Atheist
33	Leon	Schmidt	130	3	2025-12-09	\N	4	Christian
34	Hans	Weber	155	4	2025-12-09	\N	4	Christian
35	Karl	Muller	90	5	2025-12-09	\N	3	Christian
36	Kevin	Young	70	6	2025-12-09	\N	2	Atheist
37	Jason	Adams	65	1	2025-12-09	\N	1	Atheist
38	Eric	Baker	115	2	2025-12-09	\N	3	Christian
39	Ben	Walker	95	3	2025-12-09	\N	2	Christian
40	Luke	Scott	125	4	2025-12-09	\N	3	Christian
41	Aaron	Perez	150	5	2025-12-09	\N	4	Jewish
42	Jose	Garcia	180	6	2025-12-09	\N	4	Catholic
\.


--
-- Name: allergens_allergen_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.allergens_allergen_id_seq', 9, true);


--
-- Name: cells_cell_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.cells_cell_id_seq', 6, true);


--
-- Name: prisoners_prisoner_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.prisoners_prisoner_id_seq', 42, true);


--
-- Name: allergens allergens_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.allergens
    ADD CONSTRAINT allergens_pkey PRIMARY KEY (allergen_id);


--
-- Name: cells cells_cell_name_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.cells
    ADD CONSTRAINT cells_cell_name_key UNIQUE (cell_name);


--
-- Name: cells cells_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.cells
    ADD CONSTRAINT cells_pkey PRIMARY KEY (cell_id);


--
-- Name: prisoner_allergens prisoner_allergens_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.prisoner_allergens
    ADD CONSTRAINT prisoner_allergens_pkey PRIMARY KEY (prisoner_id, allergen_id);


--
-- Name: prisoners prisoners_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.prisoners
    ADD CONSTRAINT prisoners_pkey PRIMARY KEY (prisoner_id);


--
-- Name: prisoner_allergens prisoner_allergens_allergen_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.prisoner_allergens
    ADD CONSTRAINT prisoner_allergens_allergen_id_fkey FOREIGN KEY (allergen_id) REFERENCES public.allergens(allergen_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: prisoner_allergens prisoner_allergens_prisoner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.prisoner_allergens
    ADD CONSTRAINT prisoner_allergens_prisoner_id_fkey FOREIGN KEY (prisoner_id) REFERENCES public.prisoners(prisoner_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: prisoners prisoners_cell_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.prisoners
    ADD CONSTRAINT prisoners_cell_id_fkey FOREIGN KEY (cell_id) REFERENCES public.cells(cell_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict rGKlpNbAVltdSMKMhVklJjfWjZ2cr2MFD5twahQvTeO1SB7GfwRydmgpyhIyXs0

