import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { type Context, Hono } from "hono";
import db from "../core/dbConnector";
import { messageTable } from "../db/schema";
import { CreateMessageSchema, type CreateMessageType } from "../types/messages";

const message = new Hono();

message.post("/send", zValidator("json", CreateMessageSchema), async (c) => {
    const { content, id_users, id_conversations } = c.req.valid(
        "json",
    ) as CreateMessageType;

    try {
        const [newMessage] = await db
            .insert(messageTable)
            .values({ content, id_users, id_conversations })
            .returning();

        return c.json({
            success: true,
            message: "Message sent successfully!",
            data: newMessage,
        });
    } catch (e) {
        console.error(e);
        return c.json(
            {
                success: false,
                message: "Server error",
            },
            500,
        );
    }
});

message.get("/:id", async (c: Context) => {
    const id = !Number.isInteger(c.req.param("id"))
        ? Number(c.req.param("id"))
        : undefined;
    if (id) {
        const message = await db
            .select()
            .from(messageTable)
            .where(eq(messageTable.id, id));
        return c.json(message);
    }
    return c.json(
        {
            success: false,
            message: "Invalid id.",
        },
        404,
    );
});

message.get("/", async (c: Context) => {
    const message = await db.select().from(messageTable);
    return c.json({ success: true, data: message });
});

message.delete("/:id", async (c: Context) => {
    const id = !Number.isInteger(c.req.param("id"))
        ? Number(c.req.param("id"))
        : undefined;
    if (id) {
        const messageDeleted = await db
            .update(messageTable)
            .set({ deleted: true })
            .where(eq(messageTable.id, id));
        return c.json({
            success: true,
            message: "Message deleted successfuly",
            entity_deleted: messageDeleted,
        });
    }
    return c.json(
        {
            success: false,
            message: "Invalid id.",
        },
        404,
    );
});

export default message;
