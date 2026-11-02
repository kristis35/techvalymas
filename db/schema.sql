-- Užsakymų lentelė. Programa ją sukuria automatiškai pirmo užklausimo metu,
-- bet schemą galima paleisti ir rankiniu būdu (pvz. Supabase SQL redaktoriuje).
CREATE TABLE IF NOT EXISTS orders (
  id          uuid PRIMARY KEY,
  device      text NOT NULL,
  service     text NOT NULL,
  name        text NOT NULL,
  phone       text NOT NULL,
  email       text NOT NULL,
  pickup      boolean NOT NULL DEFAULT false,
  address     text,
  comment     text,
  source      text,
  status      text NOT NULL DEFAULT 'naujas'
              CHECK (status IN ('naujas','susisiekta','patvirtintas','baigtas','atsauktas')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at DESC);
