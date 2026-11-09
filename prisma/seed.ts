import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/shared/api/generated/prisma/client";
import { demoCase } from "../src/entities/legal-case/model/demo-case";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required. Run npm run db:local first.");
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

async function main() {
  await db.$transaction(async tx => {
    const client = await tx.client.upsert({ where: { id: "demo-client" }, update: {}, create: { id: "demo-client", name: demoCase.client } });
    const lawyer = await tx.lawyer.upsert({ where: { email: "anna@example.test" }, update: {}, create: { name: demoCase.lawyer, email: "anna@example.test" } });
    const legalCase = await tx.legalCase.upsert({
      where: { number: demoCase.number }, update: {},
      create: { number: demoCase.number, title: demoCase.title, description: demoCase.description, category: demoCase.category, openedAt: new Date(demoCase.openedAt), clientId: client.id, lawyerId: lawyer.id },
    });
    const kinds = { opened: "OPENED", deadline: "DEADLINE", hearing: "HEARING" } as const;
    for (const event of demoCase.events) {
      await tx.caseEvent.upsert({ where: { id: event.id }, update: {}, create: { id: event.id, caseId: legalCase.id, kind: kinds[event.kind], title: event.title, description: event.description, date: new Date(event.date) } });
    }
  });
  console.log("Seed ready: CASE-001 with three events. Existing records were preserved.");
}

main().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => db.$disconnect());
