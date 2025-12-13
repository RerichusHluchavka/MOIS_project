--
-- PostgreSQL database dump
--

-- Dumped from database version 15.15 (Debian 15.15-1.pgdg13+1)
-- Dumped by pg_dump version 15.15 (Debian 15.15-1.pgdg13+1)

SET statement_timeout = 0;
SET
    lock_timeout = 0;
SET
    idle_in_transaction_session_timeout = 0;
SET
    client_encoding = 'UTF8';
SET
    standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET
    check_function_bodies = false;
SET
    xmloption = content;
SET
    client_min_messages = warning;
SET
    row_security = off;

SET
    default_tablespace = '';

SET
    default_table_access_method = heap;

--
-- Name: allergens; Type: TABLE; Schema: public; Owner: admin
--
CREATE TABLE public.allergens
(
    allergen_id   integer                NOT NULL,
    allergen_name character varying(100) NOT NULL
);

ALTER TABLE public.allergens
    OWNER TO admin;

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

ALTER TABLE public.allergens_allergen_id_seq
    OWNER TO admin;

ALTER SEQUENCE public.allergens_allergen_id_seq OWNED BY public.allergens.allergen_id;

ALTER TABLE ONLY public.allergens
    ALTER COLUMN allergen_id SET DEFAULT nextval('public.allergens_allergen_id_seq'::regclass);

--
-- Name: food; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.food
(
    food_id   integer                NOT NULL,
    food_name character varying(100) NOT NULL
);


ALTER TABLE public.food
    OWNER TO admin;

--
-- Name: food_food_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.food_food_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE CACHE 1;


ALTER TABLE public.food_food_id_seq
    OWNER TO admin;

--
-- Name: food_food_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.food_food_id_seq OWNED BY public.food.food_id;


--
-- Name: food_ingredients; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.food_ingredients
(
    ingredient_id  integer                NOT NULL,
    food_id        integer                NOT NULL,
    unit           character varying(100) NOT NULL,
    portion_amount integer                NOT NULL
);


ALTER TABLE public.food_ingredients
    OWNER TO admin;

--
-- Name: ingredient_allergens; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.ingredient_allergens
(
    ingredient_id integer NOT NULL,
    allergen_id   integer NOT NULL
);


ALTER TABLE public.ingredient_allergens
    OWNER TO admin;

--
-- Name: ingredients; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.ingredients
(
    ingredient_id integer                NOT NULL,
    name          character varying(100) NOT NULL,
    unit          character varying(100) NOT NULL
);

ALTER TABLE public.ingredients
    OWNER TO admin;
--
-- Name: ingredients_ingredient_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.ingredients_ingredient_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE CACHE 1;


ALTER TABLE public.ingredients_ingredient_id_seq
    OWNER TO admin;

--
-- Name: ingredients_ingredient_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.ingredients_ingredient_id_seq OWNED BY public.ingredients.ingredient_id;


--
-- Name: today_menu; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.today_menu
(
    food_id            integer NOT NULL,
    cost               integer NOT NULL,
    portions_available integer
);


ALTER TABLE public.today_menu
    OWNER TO admin;

--
-- Name: food food_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.food
    ALTER COLUMN food_id SET DEFAULT nextval('public.food_food_id_seq'::regclass);


--
-- Name: ingredients ingredient_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ingredients
    ALTER COLUMN ingredient_id SET DEFAULT nextval('public.ingredients_ingredient_id_seq'::regclass);


--
-- Data for Name: allergens; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.allergens (allergen_id, allergen_name)
VALUES (1, 'Obiloviny obsahující lepek'),
       (2, 'Korýši'),
       (3, 'Vejce'),
       (4, 'Ryby'),
       (5, 'Arašídy'),
       (6, 'Sójové boby'),
       (7, 'Mléko'),
       (8, 'Skořápkové plody'),
       (9, 'Celer'),
       (10, 'Hořčice'),
       (11, 'Sezamová semena'),
       (12, 'Oxid siřičitý a siřičitany'),
       (13, 'Vlčí bob (lupina)'),
       (14, 'Měkkýši');

--
-- Data for Name: food; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.food (food_id, food_name)
VALUES (1, 'Kuřecí paprikáš s rýží'),
       (2, 'Svíčková na smetaně'),
       (3, 'Bramborák'),
       (4, 'Rajská omáčka s knedlíkem'),
       (5, 'Čočka na kyselo s vejcem'),
       (6, 'Palačinky s marmeládou'),
       (7, 'Guláš s houskovým knedlíkem'),
       (8, 'Špenát s vejcem a bramborem'),
       (9, 'Pečené kuře s bramborami'),
       (10, 'Těstoviny carbonara');

--
-- Data for Name: ingredients; Type: TABLE DATA; Schema: public; Owner: admin
--
-- Note: kitchen_export.sql doesn't have a per-ingredient "unit" column.
-- Here it's derived from how each ingredient is used in food_ingredients (g/ml/ks).

INSERT INTO public.ingredients (ingredient_id, name, unit)
VALUES (1, 'Kuřecí maso', 'g'),
       (2, 'Paprika', 'g'),
       (3, 'Cibule', 'g'),
       (4, 'Rýže', 'g'),
       (5, 'Hovězí maso', 'g'),
       (6, 'Smetana', 'ml'),
       (7, 'Brambory', 'g'),
       (8, 'Mouka', 'g'),
       (9, 'Vejce', 'ks'),
       (10, 'Mléko', 'ml'),
       (11, 'Rajský protlak', 'g'),
       (12, 'Houskový knedlík', 'g'),
       (13, 'Čočka', 'g'),
       (14, 'Ocet', 'ml'),
       (15, 'Cukr', 'g'),
       (16, 'Marmeláda', 'g'),
       (17, 'Slanina', 'g'),
       (18, 'Sýr', 'g'),
       (19, 'Špenát', 'g'),
       (20, 'Máslo', 'g'),
       (21, 'Sůl', 'g'),
       (22, 'Pepř', 'g'),
       (23, 'Kmín', 'g'),
       (24, 'Majoránka', 'g'),
       (25, 'Nové koření', 'g'),
       (26, 'Bobkový list', 'g'),
       (27, 'Těstoviny', 'g');

--
-- Data for Name: food_ingredients; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.food_ingredients (food_id, ingredient_id, portion_amount, unit)
VALUES (1, 1, 500, 'g'),
       (1, 2, 400, 'g'),
       (1, 3, 200, 'g'),
       (1, 20, 30, 'g'),
       (1, 21, 10, 'g'),
       (1, 22, 5, 'g'),
       (1, 4, 300, 'g'),
       (2, 5, 600, 'g'),
       (2, 3, 150, 'g'),
       (2, 6, 200, 'ml'),
       (2, 20, 50, 'g'),
       (2, 7, 800, 'g'),
       (2, 21, 10, 'g'),
       (2, 24, 5, 'g'),
       (2, 25, 3, 'g'),
       (2, 26, 2, 'g'),
       (3, 7, 1000, 'g'),
       (3, 3, 100, 'g'),
       (3, 8, 100, 'g'),
       (3, 9, 2, 'ks'),
       (3, 21, 10, 'g'),
       (3, 23, 5, 'g'),
       (4, 5, 500, 'g'),
       (4, 11, 300, 'g'),
       (4, 3, 100, 'g'),
       (4, 6, 100, 'ml'),
       (4, 12, 400, 'g'),
       (4, 21, 10, 'g'),
       (4, 15, 20, 'g'),
       (5, 13, 300, 'g'),
       (5, 3, 80, 'g'),
       (5, 14, 30, 'ml'),
       (5, 9, 4, 'ks'),
       (5, 21, 10, 'g'),
       (5, 23, 5, 'g'),
       (6, 8, 200, 'g'),
       (6, 9, 3, 'ks'),
       (6, 10, 300, 'ml'),
       (6, 16, 150, 'g'),
       (6, 20, 20, 'g'),
       (6, 21, 5, 'g'),
       (7, 5, 700, 'g'),
       (7, 3, 250, 'g'),
       (7, 8, 50, 'g'),
       (7, 21, 10, 'g'),
       (7, 22, 5, 'g'),
       (7, 23, 5, 'g'),
       (7, 24, 5, 'g'),
       (7, 12, 400, 'g'),
       (8, 19, 500, 'g'),
       (8, 9, 4, 'ks'),
       (8, 7, 600, 'g'),
       (8, 3, 50, 'g'),
       (8, 20, 30, 'g'),
       (8, 21, 10, 'g'),
       (9, 1, 1200, 'g'),
       (9, 7, 800, 'g'),
       (9, 3, 100, 'g'),
       (9, 21, 15, 'g'),
       (9, 22, 8, 'g'),
       (9, 23, 5, 'g'),
       (10, 27, 400, 'g'),
       (10, 17, 150, 'g'),
       (10, 9, 3, 'ks'),
       (10, 18, 100, 'g'),
       (10, 21, 8, 'g'),
       (10, 22, 5, 'g');

--
-- Data for Name: ingredient_allergens; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.ingredient_allergens (ingredient_id, allergen_id)
VALUES (8, 1),
       (12, 1),
       (18, 1),
       (10, 2),
       (6, 2),
       (20, 2),
       (18, 2),
       (9, 3),
       (17, 4),
       (20, 1);

--
-- Data for Name: today_menu; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.today_menu (food_id, cost, portions_available)
VALUES (1, 5, 2);

-- ... existing code ...

--
-- Name: allergens_allergen_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.allergens_allergen_id_seq', 14, true);

--
-- Name: food_food_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.food_food_id_seq', 10, true);

--
-- Name: ingredients_ingredient_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.ingredients_ingredient_id_seq', 27, true);


--
-- Name: allergens allergens_allergen_name_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.allergens
    ADD CONSTRAINT allergens_allergen_name_key UNIQUE (allergen_name);


--
-- Name: allergens allergens_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.allergens
    ADD CONSTRAINT allergens_pkey PRIMARY KEY (allergen_id);


--
-- Name: food_ingredients food_ingredients_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.food_ingredients
    ADD CONSTRAINT food_ingredients_pkey PRIMARY KEY (ingredient_id, food_id);


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
    ADD CONSTRAINT food_ingredients_food_id_fkey FOREIGN KEY (food_id) REFERENCES public.food (food_id) ON
        DELETE
        CASCADE;


--
-- Name: food_ingredients food_ingredients_ingredient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.food_ingredients
    ADD CONSTRAINT food_ingredients_ingredient_id_fkey FOREIGN KEY (ingredient_id) REFERENCES public.ingredients (ingredient_id) ON
        DELETE
        CASCADE;


--
-- Name: ingredient_allergens ingredient_allergens_allergen_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ingredient_allergens
    ADD CONSTRAINT ingredient_allergens_allergen_id_fkey FOREIGN KEY (allergen_id) REFERENCES public.allergens (allergen_id) ON
        DELETE
        CASCADE;


--
-- Name: ingredient_allergens ingredient_allergens_ingredient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ingredient_allergens
    ADD CONSTRAINT ingredient_allergens_ingredient_id_fkey FOREIGN KEY (ingredient_id) REFERENCES public.ingredients (ingredient_id) ON
        DELETE
        CASCADE;


--
-- PostgreSQL database dump complete
--