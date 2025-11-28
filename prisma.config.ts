import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

config(); // charge .env si présent
config({ path: ".env.local", override: true });
config({ path: "env.local", override: true });

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});

