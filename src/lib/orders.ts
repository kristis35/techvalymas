import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { Pool } from "pg";

// Užsakymų saugykla. Jei nustatytas DATABASE_URL – naudojama PostgreSQL (arba Supabase,
// kuri taip pat yra PostgreSQL). Kitu atveju užsakymai saugomi JSON faile (patogu vystymui
// arba mažam VPS be duomenų bazės).

export const ORDER_STATUSES = [
  "naujas",
  "susisiekta",
  "patvirtintas",
  "baigtas",
  "atsauktas",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  naujas: "Naujas",
  susisiekta: "Susisiekta",
  patvirtintas: "Patvirtintas",
  baigtas: "Baigtas",
  atsauktas: "Atšauktas",
};

export type NewOrder = {
  device: string;
  service: string;
  name: string;
  phone: string;
  email: string;
  pickup: boolean;
  address: string | null;
  comment: string | null;
  source: string | null;
};

export type Order = NewOrder & {
  id: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
};

interface Store {
  create(order: NewOrder): Promise<Order>;
  list(): Promise<Order[]>;
  updateStatus(id: string, status: OrderStatus): Promise<void>;
}

// ---------- PostgreSQL ----------

type Row = {
  id: string;
  device: string;
  service: string;
  name: string;
  phone: string;
  email: string;
  pickup: boolean;
  address: string | null;
  comment: string | null;
  source: string | null;
  status: OrderStatus;
  created_at: Date;
  updated_at: Date;
};

const fromRow = (r: Row): Order => ({
  id: r.id,
  device: r.device,
  service: r.service,
  name: r.name,
  phone: r.phone,
  email: r.email,
  pickup: r.pickup,
  address: r.address,
  comment: r.comment,
  source: r.source,
  status: r.status,
  createdAt: r.created_at.toISOString(),
  updatedAt: r.updated_at.toISOString(),
});

const SCHEMA = `
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
`;

function pgStore(connectionString: string): Store {
  const g = globalThis as unknown as { __ordersPool?: Pool; __ordersSchema?: Promise<unknown> };
  const pool =
    g.__ordersPool ??
    (g.__ordersPool = new Pool({
      connectionString,
      max: 5,
      ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
    }));
  const ready = () => (g.__ordersSchema ??= pool.query(SCHEMA));

  return {
    async create(o) {
      await ready();
      const { rows } = await pool.query<Row>(
        `INSERT INTO orders (id, device, service, name, phone, email, pickup, address, comment, source)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
        [randomUUID(), o.device, o.service, o.name, o.phone, o.email, o.pickup, o.address, o.comment, o.source],
      );
      return fromRow(rows[0]);
    },
    async list() {
      await ready();
      const { rows } = await pool.query<Row>(`SELECT * FROM orders ORDER BY created_at DESC LIMIT 1000`);
      return rows.map(fromRow);
    },
    async updateStatus(id, status) {
      await ready();
      await pool.query(`UPDATE orders SET status = $2, updated_at = now() WHERE id = $1`, [id, status]);
    },
  };
}

// ---------- JSON failas ----------

function fileStore(file: string): Store {
  let queue: Promise<unknown> = Promise.resolve();
  // Visi įrašymai vykdomi nuosekliai, kad lygiagrečios užklausos neperrašytų viena kitos.
  const serial = <T>(fn: () => Promise<T>): Promise<T> => {
    const next = queue.then(fn, fn);
    queue = next.catch(() => undefined);
    return next;
  };

  async function read(): Promise<Order[]> {
    try {
      return JSON.parse(await fs.readFile(file, "utf8")) as Order[];
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw e;
    }
  }
  async function write(orders: Order[]) {
    await fs.mkdir(path.dirname(file), { recursive: true });
    const tmp = `${file}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(orders, null, 2), "utf8");
    await fs.rename(tmp, file);
  }

  return {
    create: (o) =>
      serial(async () => {
        const now = new Date().toISOString();
        const order: Order = { ...o, id: randomUUID(), status: "naujas", createdAt: now, updatedAt: now };
        const orders = await read();
        orders.unshift(order);
        await write(orders);
        return order;
      }),
    list: async () => (await read()).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    updateStatus: (id, status) =>
      serial(async () => {
        const orders = await read();
        const o = orders.find((x) => x.id === id);
        if (!o) return;
        o.status = status;
        o.updatedAt = new Date().toISOString();
        await write(orders);
      }),
  };
}

let store: Store | undefined;
function getStore(): Store {
  if (!store) {
    store = process.env.DATABASE_URL
      ? pgStore(process.env.DATABASE_URL)
      : fileStore(process.env.ORDERS_FILE ?? path.join(process.cwd(), "data", "orders.json"));
  }
  return store;
}

export const createOrder = (o: NewOrder) => getStore().create(o);
export const listOrders = () => getStore().list();
export const updateOrderStatus = (id: string, status: OrderStatus) => getStore().updateStatus(id, status);
