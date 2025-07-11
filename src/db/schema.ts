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
    user_id: integer().references(() => userTable.id),
    deviceToken: text("device_token").notNull(),
    platform: text().notNull(),
    deviceName: text("device_name").notNull(),
    appVersion: text("app_version").notNull(),
    ...timestamp,
});

export const userTable = sqliteTable("users", {
    id: integer().primaryKey({ autoIncrement: true }),
    name: text().notNull().unique(),
    email: text().notNull().unique(),
    password: text().notNull(),
    token: integer().references(() => refreshTokenTable.id),
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
