import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const timestamp = {
    created_at: text().default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: text().default(sql`CURRENT_TIMESTAMP`),
};

export const conversationTable = sqliteTable("conversations", {
    id: integer().primaryKey({ autoIncrement: true }),
    name: text().notNull().unique(),
    ...timestamp,
});

export const refreshTokenTable = sqliteTable("refresh_tokens", {
    id: integer().primaryKey({ autoIncrement: true }),
    refresh_token: text().notNull(),
    ...timestamp,
});

export const deviceTokenTable = sqliteTable("device_tokens", {
    id: integer().primaryKey({ autoIncrement: true }),
    device_token: text().notNull(),
    ...timestamp,
});

export const userTable = sqliteTable("users", {
    id: integer().primaryKey({ autoIncrement: true }),
    name: text().notNull().unique(),
    email: text().notNull().unique(),
    password: text().notNull(),
    token: integer().references(() => refreshTokenTable.id),
    device_token: integer().references(() => deviceTokenTable.id),
    ...timestamp,
});

export const messageTable = sqliteTable("messages", {
    id: integer().primaryKey({ autoIncrement: true }),
    content: text().notNull(),
    ...timestamp,
    deleted: integer({ mode: "boolean" }),
    id_users: integer()
        .notNull()
        .references(() => userTable.id),
    id_conversations: integer()
        .notNull()
        .references(() => conversationTable.id),
});

export const isInTable = sqliteTable("is_in", {
    from: integer().references(() => userTable.id),
    to: integer().references(() => userTable.id),
    id_conversations: integer()
        .notNull()
        .references(() => conversationTable.id),
});
