import { drizzle } from "drizzle-orm/bun-sqlite";
import { env } from "./config";

const db = drizzle(env.DB_FILE_NAME);

export default db;
