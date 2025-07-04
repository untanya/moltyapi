import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { type Context, Hono } from "hono";
import db from "../core/dbConnector";
import { conversationTable } from "../db/schema";
import {
    CreateConversationSchema,
    type CreateConversationType,
} from "../types/conversations";

const conversation = new Hono();

conversation.get("/:id", async (c: Context) => {
    const id = !Number.isInteger(c.req.param("id"))
        ? Number(c.req.param("id"))
        : undefined;
    if (id) {
        const message = await db
            .select()
            .from(conversationTable)
            .where(eq(conversationTable.id, id));
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

conversation.get("/", async (c: Context) => {
    const message = await db.select().from(conversationTable);
    return c.json({ success: true, data: message });
});

conversation.post(
    "/create",
    zValidator("json", CreateConversationSchema),
    async (c) => {
        const { name } = c.req.valid("json") as CreateConversationType;

        try {
            const [newConversation] = await db
                .insert(conversationTable)
                .values({ name })
                .returning();

            return c.json({
                success: true,
                message: "Conversation created successfully!",
                data: newConversation,
            });
        } catch (e) {
            console.error(e);
            return c.json(
                {
                    success: false,
                    message: "Server error",
                    reason: e,
                },
                500,
            );
        }
    },
);

conversation.delete("/:id", async (c: Context) => {
    const id = !Number.isInteger(c.req.param("id"))
        ? Number(c.req.param("id"))
        : undefined;
    if (id) {
        const conversationDeleted = await db
            .delete(conversationTable)
            .where(eq(conversationTable.id, id));
        return c.json({
            success: true,
            message: "Message deleted successfuly",
            entity_deleted: conversationDeleted,
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

export default conversation;
