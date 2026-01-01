-- 1. Tabla de Escritura (El Agregado Product)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price_amount INT NOT NULL,
    price_currency CHAR(3) NOT NULL,
    stock INT NOT NULL
);

-- 2. Tabla de Eventos (La Cola del Bus)
CREATE TABLE IF NOT EXISTS domain_events (
    id UUID PRIMARY KEY,
    aggregate_id VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    body JSONB NOT NULL,
    occurred_on TIMESTAMP NOT NULL,
    processed_at TIMESTAMP
);

-- Índice para que el Worker no muera buscando pendientes
CREATE INDEX IF NOT EXISTS idx_domain_events_pending ON domain_events(processed_at) WHERE processed_at IS NULL;

-- 3. Tabla de Lectura (La Vista Materializada / Proyección)
CREATE TABLE IF NOT EXISTS products_catalog_view (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    display_price VARCHAR(50),
    is_available BOOLEAN,
    search_keywords TEXT
);