import "dotenv/config";
import assert from "node:assert/strict";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/shared/api/generated/prisma/client";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 5000 }) });
async function main() {
try {
  const legalCase = await db.legalCase.findUniqueOrThrow({ where: { number: "CASE-001" }, include: { client: true, lawyer: true, events: { orderBy: { date: "asc" } } } });
  assert.equal(legalCase.events.length, 3);
  assert.deepEqual(legalCase.events.map(event => event.kind), ["OPENED", "DEADLINE", "HEARING"]);
  assert.ok(legalCase.client.name);
  assert.ok(legalCase.lawyer.name);
  console.log("PostgreSQL + Prisma OK: CASE-001, client, lawyer and three ordered events.");
} finally { await db.$disconnect(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
