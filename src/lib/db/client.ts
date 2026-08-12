import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// HTTP driver da Neon — funciona igual em dev local e em função serverless
// da Vercel, sem pool de conexão pra gerenciar. DATABASE_URL vem do Postgres
// provisionado em Vercel → Storage (ou de outro provedor Postgres/Neon).
const sql = neon(process.env.DATABASE_URL ?? process.env.POSTGRES_URL!);

export const db = drizzle(sql, { schema });
