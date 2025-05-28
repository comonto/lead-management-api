CREATE TABLE
    lead (
        id SERIAL PRIMARY KEY,
        phone VARCHAR(20) UNIQUE NOT NULL,
        city VARCHAR(100) NOT NULL,
        home_value NUMERIC NOT NULL,
        mortgage_amount NUMERIC NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    intestatario (
        id SERIAL PRIMARY KEY,
        type VARCHAR(10) NOT NULL CHECK (type IN ('first', 'second')),
        nome VARCHAR(100) NOT NULL,
        cognome VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL,
        data_nascita DATE NOT NULL,
        reddito_mensile NUMERIC NOT NULL CHECK (reddito_mensile > 0),
        mensilita INTEGER NOT NULL CHECK (mensilita IN (12, 13, 14)),
        lead_id INTEGER NOT NULL,
        CONSTRAINT fk_lead FOREIGN KEY (lead_id) REFERENCES lead (id) ON DELETE CASCADE
    );

CREATE TABLE
    simulazione (
        id SERIAL PRIMARY KEY,
        lead_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_lead_simulazione FOREIGN KEY (lead_id) REFERENCES lead (id) ON DELETE CASCADE
    );

-- Estensione per supporto UUID
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ENUM HolderType
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'holdertype') THEN
        CREATE TYPE HolderType AS ENUM ('first', 'second');
    END IF;
END$$;

-- Drop delle tabelle in ordine corretto (per FK)
DROP TABLE IF EXISTS simulation;

DROP TABLE IF EXISTS holder;

DROP TABLE IF EXISTS lead;

-- Tabella: lead
CREATE TABLE
    lead (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        phone_number VARCHAR(20) NOT NULL UNIQUE,
        mortgage_amount DECIMAL(10, 2) NOT NULL,
        home_value DECIMAL(10, 2) NOT NULL,
        city VARCHAR(100) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

-- Tabella: holder
CREATE TABLE
    holder (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        type HolderType NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        date_of_birth DATE NOT NULL,
        monthly_income DECIMAL(10, 2) NOT NULL,
        income_breakdown INTEGER NOT NULL DEFAULT 12 CHECK (income_breakdown IN (12, 13, 14)),
        lead_id UUID NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_holder_lead FOREIGN KEY (lead_id) REFERENCES lead (id) ON DELETE CASCADE
    );

-- Tabella: simulation
CREATE TABLE
    simulation (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        request_hash VARCHAR(64) NOT NULL,
        timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        lead_id UUID NOT NULL,
        CONSTRAINT fk_simulation_lead FOREIGN KEY (lead_id) REFERENCES lead (id) ON DELETE CASCADE
    );

-- Indice opzionale per ottimizzare le ricerche per città
CREATE INDEX idx_lead_city ON lead (city);