import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  // Generating the client and validating the schema do not require a running DB.
  datasource: { url: process.env.DATABASE_URL ?? "postgresql://crm_admin:local_dev_only@127.0.0.1:5433/legal_crm" },
});
