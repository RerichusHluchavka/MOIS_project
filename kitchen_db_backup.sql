--
-- PostgreSQL database dump
--

\restrict RXaOdV1FvQgfpA2x5YIT6S60362nYXirxonfMNlVABxOFELfvUacATIV9jJEQrk

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
-- Name: food; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.food (
    food_id integer NOT NULL,
    food_name character varying NOT NULL
);


ALTER TABLE public.food OWNER TO admin;

--
-- Name: food_food_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.food_food_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.food_food_id_seq OWNER TO admin;

--
-- Name: food_food_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.food_food_id_seq OWNED BY public.food.food_id;


--
-- Name: food_ingredients; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.food_ingredients (
    food_id integer NOT NULL,
    ingredient_id integer NOT NULL,
    portion_amount numeric NOT NULL,
    unit character varying NOT NULL
);


ALTER TABLE public.food_ingredients OWNER TO admin;

--
-- Name: ingredient_allergens; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.ingredient_allergens (
    ingredient_id integer NOT NULL,
    allergen_id integer NOT NULL
);


ALTER TABLE public.ingredient_allergens OWNER TO admin;

--
-- Name: ingredients; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.ingredients (
    ingredient_id integer NOT NULL,
    name character varying NOT NULL,
    unit character varying NOT NULL
);


ALTER TABLE public.ingredients OWNER TO admin;

--
-- Name: ingredients_ingredient_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.ingredients_ingredient_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ingredients_ingredient_id_seq OWNER TO admin;

--
-- Name: ingredients_ingredient_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.ingredients_ingredient_id_seq OWNED BY public.ingredients.ingredient_id;


--
-- Name: today_menu; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.today_menu (
    food_id integer NOT NULL,
    cost integer NOT NULL,
    portions_available integer NOT NULL
);


ALTER TABLE public.today_menu OWNER TO admin;

--
-- Name: allergens allergen_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.allergens ALTER COLUMN allergen_id SET DEFAULT nextval('public.allergens_allergen_id_seq'::regclass);


--
-- Name: food food_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.food ALTER COLUMN food_id SET DEFAULT nextval('public.food_food_id_seq'::regclass);


--
-- Name: ingredients ingredient_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ingredients ALTER COLUMN ingredient_id SET DEFAULT nextval('public.ingredients_ingredient_id_seq'::regclass);


--
-- Data for Name: allergens; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.allergens (allergen_id, allergen_name) FROM stdin;
1	Peanuts
2	Milk
3	Gluten
\.


--
-- Data for Name: food; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.food (food_id, food_name) FROM stdin;
1	Meal A
2	Meal B
3	Meal C
\.


--
-- Data for Name: food_ingredients; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.food_ingredients (food_id, ingredient_id, portion_amount, unit) FROM stdin;
1	1	200	g
1	2	150	g
1	4	10	g
\.


--
-- Data for Name: ingredient_allergens; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.ingredient_allergens (ingredient_id, allergen_id) FROM stdin;
1	1
3	2
2	3
\.


--
-- Data for Name: ingredients; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.ingredients (ingredient_id, name, unit) FROM stdin;
1	Chicken	g
2	Rice	g
3	Milk	ml
4	Peanuts	g
\.


--
-- Data for Name: today_menu; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.today_menu (food_id, cost, portions_available) FROM stdin;
2	90	75
3	110	43
1	100	87
\.


--
-- Name: allergens_allergen_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.allergens_allergen_id_seq', 3, true);


--
-- Name: food_food_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.food_food_id_seq', 3, true);


--
-- Name: ingredients_ingredient_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.ingredients_ingredient_id_seq', 4, true);


--
-- Name: allergens allergens_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.allergens
    ADD CONSTRAINT allergens_pkey PRIMARY KEY (allergen_id);


--
-- Name: food_ingredients food_ingredients_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.food_ingredients
    ADD CONSTRAINT food_ingredients_pkey PRIMARY KEY (food_id, ingredient_id);


--
-- Name: food food_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.food
    ADD CONSTRAINT food_pkey PRIMARY KEY (food_id);


--
-- Name: ingredient_allergens ingredient_allergens_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ingredient_allergens
    ADD CONSTRAINT ingredient_allergens_pkey PRIMARY KEY (ingredient_id, allergen_id);


--
-- Name: ingredients ingredients_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ingredients
    ADD CONSTRAINT ingredients_pkey PRIMARY KEY (ingredient_id);


--
-- Name: today_menu today_menu_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.today_menu
    ADD CONSTRAINT today_menu_pkey PRIMARY KEY (food_id);


--
-- Name: food_ingredients food_ingredients_food_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.food_ingredients
    ADD CONSTRAINT food_ingredients_food_id_fkey FOREIGN KEY (food_id) REFERENCES public.food(food_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: food_ingredients food_ingredients_ingredient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.food_ingredients
    ADD CONSTRAINT food_ingredients_ingredient_id_fkey FOREIGN KEY (ingredient_id) REFERENCES public.ingredients(ingredient_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ingredient_allergens ingredient_allergens_allergen_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ingredient_allergens
    ADD CONSTRAINT ingredient_allergens_allergen_id_fkey FOREIGN KEY (allergen_id) REFERENCES public.allergens(allergen_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ingredient_allergens ingredient_allergens_ingredient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ingredient_allergens
    ADD CONSTRAINT ingredient_allergens_ingredient_id_fkey FOREIGN KEY (ingredient_id) REFERENCES public.ingredients(ingredient_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: today_menu today_menu_food_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.today_menu
    ADD CONSTRAINT today_menu_food_id_fkey FOREIGN KEY (food_id) REFERENCES public.food(food_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict RXaOdV1FvQgfpA2x5YIT6S60362nYXirxonfMNlVABxOFELfvUacATIV9jJEQrk

