--
-- PostgreSQL database dump
--

-- Dumped from database version 15.14 (Debian 15.14-1.pgdg13+1)
-- Dumped by pg_dump version 15.13 (Debian 15.13-0+deb12u1)

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: suiver
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO suiver;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: suiver
--

COMMENT ON SCHEMA public IS '';


--
-- Name: TransactionType; Type: TYPE; Schema: public; Owner: suiver
--

CREATE TYPE public."TransactionType" AS ENUM (
    'DEPOSIT',
    'WITHDRAW',
    'SEND',
    'RECEIVE',
    'REQUEST'
);


ALTER TYPE public."TransactionType" OWNER TO suiver;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Beneficiary; Type: TABLE; Schema: public; Owner: suiver
--

CREATE TABLE public."Beneficiary" (
    id text NOT NULL,
    "userId" text NOT NULL,
    name text NOT NULL,
    tag text NOT NULL,
    "accountNo" text,
    "bankName" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Beneficiary" OWNER TO suiver;

--
-- Name: CryptoAddress; Type: TABLE; Schema: public; Owner: suiver
--

CREATE TABLE public."CryptoAddress" (
    id text NOT NULL,
    "userId" text NOT NULL,
    currency text NOT NULL,
    address text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."CryptoAddress" OWNER TO suiver;

--
-- Name: CryptoDeposit; Type: TABLE; Schema: public; Owner: suiver
--

CREATE TABLE public."CryptoDeposit" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "txHash" text NOT NULL,
    address text NOT NULL,
    currency text NOT NULL,
    amount bigint NOT NULL,
    "ngnAmount" bigint NOT NULL,
    fee bigint NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."CryptoDeposit" OWNER TO suiver;

--
-- Name: PaymentLink; Type: TABLE; Schema: public; Owner: suiver
--

CREATE TABLE public."PaymentLink" (
    id integer NOT NULL,
    "userId" text NOT NULL,
    amount bigint,
    "openAmount" boolean DEFAULT false NOT NULL,
    code text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."PaymentLink" OWNER TO suiver;

--
-- Name: PaymentLink_id_seq; Type: SEQUENCE; Schema: public; Owner: suiver
--

CREATE SEQUENCE public."PaymentLink_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."PaymentLink_id_seq" OWNER TO suiver;

--
-- Name: PaymentLink_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: suiver
--

ALTER SEQUENCE public."PaymentLink_id_seq" OWNED BY public."PaymentLink".id;


--
-- Name: Referral; Type: TABLE; Schema: public; Owner: suiver
--

CREATE TABLE public."Referral" (
    id text NOT NULL,
    code text NOT NULL,
    "inviterId" text NOT NULL,
    "inviteeId" text,
    reward bigint DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Referral" OWNER TO suiver;

--
-- Name: Transaction; Type: TABLE; Schema: public; Owner: suiver
--

CREATE TABLE public."Transaction" (
    id integer NOT NULL,
    "userId" text NOT NULL,
    "fromWalletId" integer NOT NULL,
    "toWalletId" integer NOT NULL,
    type public."TransactionType" NOT NULL,
    amount bigint NOT NULL,
    currency text NOT NULL,
    description text,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Transaction" OWNER TO suiver;

--
-- Name: Transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: suiver
--

CREATE SEQUENCE public."Transaction_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Transaction_id_seq" OWNER TO suiver;

--
-- Name: Transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: suiver
--

ALTER SEQUENCE public."Transaction_id_seq" OWNED BY public."Transaction".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: suiver
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    phone text,
    tag text,
    "firstName" text,
    "lastName" text,
    "kycStatus" text DEFAULT 'NOT_SUBMITTED'::text,
    "referralCode" text,
    "referredById" text,
    "biometricEnabled" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "socType" text
);


ALTER TABLE public."User" OWNER TO suiver;

--
-- Name: UserSecurity; Type: TABLE; Schema: public; Owner: suiver
--

CREATE TABLE public."UserSecurity" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "pinHash" text,
    "twoFA" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    biometric text
);


ALTER TABLE public."UserSecurity" OWNER TO suiver;

--
-- Name: Wallet; Type: TABLE; Schema: public; Owner: suiver
--

CREATE TABLE public."Wallet" (
    id integer NOT NULL,
    "userId" text NOT NULL,
    balance bigint DEFAULT 0 NOT NULL,
    currency text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Wallet" OWNER TO suiver;

--
-- Name: Wallet_id_seq; Type: SEQUENCE; Schema: public; Owner: suiver
--

CREATE SEQUENCE public."Wallet_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Wallet_id_seq" OWNER TO suiver;

--
-- Name: Wallet_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: suiver
--

ALTER SEQUENCE public."Wallet_id_seq" OWNED BY public."Wallet".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: suiver
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO suiver;

--
-- Name: otps; Type: TABLE; Schema: public; Owner: suiver
--

CREATE TABLE public.otps (
    id text NOT NULL,
    email text NOT NULL,
    type text NOT NULL,
    code text NOT NULL,
    verified boolean DEFAULT false NOT NULL,
    attempts integer DEFAULT 0 NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.otps OWNER TO suiver;

--
-- Name: PaymentLink id; Type: DEFAULT; Schema: public; Owner: suiver
--

ALTER TABLE ONLY public."PaymentLink" ALTER COLUMN id SET DEFAULT nextval('public."PaymentLink_id_seq"'::regclass);


--
-- Name: Transaction id; Type: DEFAULT; Schema: public; Owner: suiver
--

ALTER TABLE ONLY public."Transaction" ALTER COLUMN id SET DEFAULT nextval('public."Transaction_id_seq"'::regclass);


--
-- Name: Wallet id; Type: DEFAULT; Schema: public; Owner: suiver
--

ALTER TABLE ONLY public."Wallet" ALTER COLUMN id SET DEFAULT nextval('public."Wallet_id_seq"'::regclass);


--
-- Data for Name: Beneficiary; Type: TABLE DATA; Schema: public; Owner: suiver
--

COPY public."Beneficiary" (id, "userId", name, tag, "accountNo", "bankName", "createdAt") FROM stdin;
\.


--
-- Data for Name: CryptoAddress; Type: TABLE DATA; Schema: public; Owner: suiver
--

COPY public."CryptoAddress" (id, "userId", currency, address, "createdAt") FROM stdin;
\.


--
-- Data for Name: CryptoDeposit; Type: TABLE DATA; Schema: public; Owner: suiver
--

COPY public."CryptoDeposit" (id, "userId", "txHash", address, currency, amount, "ngnAmount", fee, status, "createdAt") FROM stdin;
\.


--
-- Data for Name: PaymentLink; Type: TABLE DATA; Schema: public; Owner: suiver
--

COPY public."PaymentLink" (id, "userId", amount, "openAmount", code, "createdAt") FROM stdin;
\.


--
-- Data for Name: Referral; Type: TABLE DATA; Schema: public; Owner: suiver
--

COPY public."Referral" (id, code, "inviterId", "inviteeId", reward, "createdAt") FROM stdin;
\.


--
-- Data for Name: Transaction; Type: TABLE DATA; Schema: public; Owner: suiver
--

COPY public."Transaction" (id, "userId", "fromWalletId", "toWalletId", type, amount, currency, description, status, "createdAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: suiver
--

COPY public."User" (id, email, password, phone, tag, "firstName", "lastName", "kycStatus", "referralCode", "referredById", "biometricEnabled", "createdAt", "updatedAt", "socType") FROM stdin;
\.


--
-- Data for Name: UserSecurity; Type: TABLE DATA; Schema: public; Owner: suiver
--

COPY public."UserSecurity" (id, "userId", "pinHash", "twoFA", "createdAt", "updatedAt", biometric) FROM stdin;
\.


--
-- Data for Name: Wallet; Type: TABLE DATA; Schema: public; Owner: suiver
--

COPY public."Wallet" (id, "userId", balance, currency, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: suiver
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
7249a992-fafb-4b40-868e-cd40b67a646b	ed33aea46d4ac2ae64aa19c2dc983a3aeb1ac6aa87c30c82fe9431e5eb067761	2025-09-18 00:28:44.336614+00	20250914004259_init	\N	\N	2025-09-18 00:28:41.953683+00	1
12f50176-a358-4a1b-9892-9476473cd305	8409ff92529ca2c239203f2a3be2863dfd76978cad0dda314008f09e31dd23a8	\N	20250916173731_sync_schema	A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20250916173731_sync_schema\n\nDatabase error code: 42703\n\nDatabase error:\nERROR: column "documentType" of relation "User" does not exist\n\nDbError { severity: "ERROR", parsed_severity: Some(Error), code: SqlState(E42703), message: "column \\"documentType\\" of relation \\"User\\" does not exist", detail: None, hint: None, position: None, where_: None, schema: None, table: None, column: None, datatype: None, constraint: None, file: Some("tablecmds.c"), line: Some(8596), routine: Some("ATExecDropColumn") }\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name="20250916173731_sync_schema"\n             at schema-engine/connectors/sql-schema-connector/src/apply_migration.rs:113\n   1: schema_commands::commands::apply_migrations::Applying migration\n           with migration_name="20250916173731_sync_schema"\n             at schema-engine/commands/src/commands/apply_migrations.rs:95\n   2: schema_core::state::ApplyMigrations\n             at schema-engine/core/src/state.rs:236	\N	2025-09-18 00:28:44.410907+00	0
\.


--
-- Data for Name: otps; Type: TABLE DATA; Schema: public; Owner: suiver
--

COPY public.otps (id, email, type, code, verified, attempts, "expiresAt", "createdAt") FROM stdin;
\.


--
-- Name: PaymentLink_id_seq; Type: SEQUENCE SET; Schema: public; Owner: suiver
--

SELECT pg_catalog.setval('public."PaymentLink_id_seq"', 1, false);


--
-- Name: Transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: suiver
--

SELECT pg_catalog.setval('public."Transaction_id_seq"', 1, false);


--
-- Name: Wallet_id_seq; Type: SEQUENCE SET; Schema: public; Owner: suiver
--

SELECT pg_catalog.setval('public."Wallet_id_seq"', 1, false);


--
-- Name: Beneficiary Beneficiary_pkey; Type: CONSTRAINT; Schema: public; Owner: suiver
--

ALTER TABLE ONLY public."Beneficiary"
    ADD CONSTRAINT "Beneficiary_pkey" PRIMARY KEY (id);


--
-- Name: CryptoAddress CryptoAddress_pkey; Type: CONSTRAINT; Schema: public; Owner: suiver
--

ALTER TABLE ONLY public."CryptoAddress"
    ADD CONSTRAINT "CryptoAddress_pkey" PRIMARY KEY (id);


--
-- Name: CryptoDeposit CryptoDeposit_pkey; Type: CONSTRAINT; Schema: public; Owner: suiver
--

ALTER TABLE ONLY public."CryptoDeposit"
    ADD CONSTRAINT "CryptoDeposit_pkey" PRIMARY KEY (id);


--
-- Name: PaymentLink PaymentLink_pkey; Type: CONSTRAINT; Schema: public; Owner: suiver
--

ALTER TABLE ONLY public."PaymentLink"
    ADD CONSTRAINT "PaymentLink_pkey" PRIMARY KEY (id);


--
-- Name: Referral Referral_pkey; Type: CONSTRAINT; Schema: public; Owner: suiver
--

ALTER TABLE ONLY public."Referral"
    ADD CONSTRAINT "Referral_pkey" PRIMARY KEY (id);


--
-- Name: Transaction Transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: suiver
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY (id);


--
-- Name: UserSecurity UserSecurity_pkey; Type: CONSTRAINT; Schema: public; Owner: suiver
--

ALTER TABLE ONLY public."UserSecurity"
    ADD CONSTRAINT "UserSecurity_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: suiver
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Wallet Wallet_pkey; Type: CONSTRAINT; Schema: public; Owner: suiver
--

ALTER TABLE ONLY public."Wallet"
    ADD CONSTRAINT "Wallet_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: suiver
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: otps otps_pkey; Type: CONSTRAINT; Schema: public; Owner: suiver
--

ALTER TABLE ONLY public.otps
    ADD CONSTRAINT otps_pkey PRIMARY KEY (id);


--
-- Name: CryptoAddress_address_key; Type: INDEX; Schema: public; Owner: suiver
--

CREATE UNIQUE INDEX "CryptoAddress_address_key" ON public."CryptoAddress" USING btree (address);


--
-- Name: CryptoDeposit_txHash_key; Type: INDEX; Schema: public; Owner: suiver
--

CREATE UNIQUE INDEX "CryptoDeposit_txHash_key" ON public."CryptoDeposit" USING btree ("txHash");


--
-- Name: PaymentLink_code_key; Type: INDEX; Schema: public; Owner: suiver
--

CREATE UNIQUE INDEX "PaymentLink_code_key" ON public."PaymentLink" USING btree (code);


--
-- Name: Referral_code_key; Type: INDEX; Schema: public; Owner: suiver
--

CREATE UNIQUE INDEX "Referral_code_key" ON public."Referral" USING btree (code);


--
-- Name: UserSecurity_userId_key; Type: INDEX; Schema: public; Owner: suiver
--

CREATE UNIQUE INDEX "UserSecurity_userId_key" ON public."UserSecurity" USING btree ("userId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: suiver
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_referralCode_key; Type: INDEX; Schema: public; Owner: suiver
--

CREATE UNIQUE INDEX "User_referralCode_key" ON public."User" USING btree ("referralCode");


--
-- Name: User_tag_key; Type: INDEX; Schema: public; Owner: suiver
--

CREATE UNIQUE INDEX "User_tag_key" ON public."User" USING btree (tag);


--
-- Name: Wallet_userId_currency_key; Type: INDEX; Schema: public; Owner: suiver
--

CREATE UNIQUE INDEX "Wallet_userId_currency_key" ON public."Wallet" USING btree ("userId", currency);


--
-- Name: otps_email_type_key; Type: INDEX; Schema: public; Owner: suiver
--

CREATE UNIQUE INDEX otps_email_type_key ON public.otps USING btree (email, type);


--
-- Name: otps_expiresAt_idx; Type: INDEX; Schema: public; Owner: suiver
--

CREATE INDEX "otps_expiresAt_idx" ON public.otps USING btree ("expiresAt");


--
-- Name: Beneficiary Beneficiary_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: suiver
--

ALTER TABLE ONLY public."Beneficiary"
    ADD CONSTRAINT "Beneficiary_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CryptoAddress CryptoAddress_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: suiver
--

ALTER TABLE ONLY public."CryptoAddress"
    ADD CONSTRAINT "CryptoAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CryptoDeposit CryptoDeposit_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: suiver
--

ALTER TABLE ONLY public."CryptoDeposit"
    ADD CONSTRAINT "CryptoDeposit_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PaymentLink PaymentLink_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: suiver
--

ALTER TABLE ONLY public."PaymentLink"
    ADD CONSTRAINT "PaymentLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Transaction Transaction_fromWalletId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: suiver
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_fromWalletId_fkey" FOREIGN KEY ("fromWalletId") REFERENCES public."Wallet"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Transaction Transaction_toWalletId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: suiver
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_toWalletId_fkey" FOREIGN KEY ("toWalletId") REFERENCES public."Wallet"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Transaction Transaction_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: suiver
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserSecurity UserSecurity_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: suiver
--

ALTER TABLE ONLY public."UserSecurity"
    ADD CONSTRAINT "UserSecurity_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: User User_referredById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: suiver
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Wallet Wallet_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: suiver
--

ALTER TABLE ONLY public."Wallet"
    ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: suiver
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

