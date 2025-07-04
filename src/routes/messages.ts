import { zValidator } from "@hono/zod-validator";
import { type Context, Hono } from "hono";
import db from "../core/dbConnector";
import { messageTable } from "../db/schema";
import { CreateMessageSchema, type CreateMessageType } from "../types/messages";

const message = new Hono();

message.post(
    "/message/send",
    zValidator("json", CreateMessageSchema),
    async (c) => {
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
    },
);

message.get("/message/:id", (c: Context) => {
    const _id = c.req.param("id");
    return c.json({ success: true, message: "fetch message by id !" });
});

message.get("/messages", (c: Context) => {
    return c.json({ success: true, message: "fetch messages !" });
});

message.delete("/message/delete", (c: Context) => {
    return c.json({
        success: true,
        message: "Message deleted successfuly",
    });
});

export default message;
