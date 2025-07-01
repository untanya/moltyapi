import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./drizzle",
    schema: "./src/db/schema.ts",
    dialect: "sqlite",
    dbCredentials: {
        // biome-ignore lint/style/noNonNullAssertion: expected
        url: process.env.DB_FILE_NAME!,
    },
});
