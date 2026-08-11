import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// DATABASE_URL local: "file:./sqlite.db" (dev). Pra produção, troca só a
// URL/token pra um banco Turso — o driver libsql é o mesmo dos dois lados,
// nenhuma linha de código muda.
const client = createClient({
  url: process.env.DATABASE_URL ?? "file:./sqlite.db",
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
