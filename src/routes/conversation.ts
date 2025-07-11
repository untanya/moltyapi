import { zValidator } from "@hono/zod-validator";
import { desc, eq } from "drizzle-orm";
import { type Context, Hono } from "hono";
import db from "../core/dbConnector";
import { conversationTable, isInTable, messageTable } from "../db/schema";
import {
    CreateConversationSchema,
    type CreateConversationType,
} from "../types/conversations";

const conversation = new Hono();

conversation.get("/:id", async (c: Context) => {
    const id = Number(c.req.param("id"));

    if (!Number.isInteger(id) || id <= 0) {
        return c.json(
            {
                success: false,
                message: "Invalid id.",
            },
            404,
        );
    }

    const conversation = await db
        .select({
            id: conversationTable.id,
            createdAt: conversationTable.created_at,
        })
        .from(conversationTable)
        .where(eq(conversationTable.id, id))
        .then((rows) => rows[0]);

    if (!conversation) {
        return c.json(
            {
                success: false,
                message: "Conversation not found.",
            },
            404,
        );
    }

    const participantRows = await db
        .select({
            from: isInTable.from,
            to: isInTable.to,
        })
        .from(isInTable)
        .where(eq(isInTable.id_conversations, id));

    const participants = Array.from(
        new Set(
            participantRows
                .flatMap((row) => [row.from, row.to])
                .filter(Boolean),
        ),
    );

    const lastMessageRow = await db
        .select({
            content: messageTable.content,
            sentAt: messageTable.created_at,
        })
        .from(messageTable)
        .where(eq(messageTable.id_conversations, id))
        .orderBy(desc(messageTable.created_at))
        .limit(1)
        .then((rows) => rows[0]);

    const result = {
        id: conversation.id,
        participants,
        lastMessage: lastMessageRow?.content ?? null,
        createdAt: conversation.createdAt,
    };

    return c.json({
        success: true,
        data: result,
    });
});

conversation.get("/", async (c: Context) => {
    const conversations = await db
        .select({
            id: conversationTable.id,
            createdAt: conversationTable.created_at,
        })
        .from(conversationTable);

    const participantsRows = await db
        .select({
            conversationId: isInTable.id_conversations,
            from: isInTable.from,
            to: isInTable.to,
        })
        .from(isInTable);

    const participantsMap = new Map<number, Set<number>>();

    participantsRows.forEach((row) => {
        if (!participantsMap.has(row.conversationId)) {
            participantsMap.set(row.conversationId, new Set());
        }

        if (row.from != null)
            participantsMap.get(row.conversationId)?.add(row.from);
        if (row.to != null)
            participantsMap.get(row.conversationId)?.add(row.to);
    });

    const allMessages = await db
        .select({
            conversationId: messageTable.id_conversations,
            content: messageTable.content,
            sentAt: messageTable.created_at,
        })
        .from(messageTable)
        .orderBy(desc(messageTable.created_at));

    const lastMessagesMap = new Map<
        number,
        { content: string; sentAt: string }
    >();

    allMessages.forEach((message) => {
        if (!lastMessagesMap.has(message.conversationId)) {
            lastMessagesMap.set(message.conversationId, {
                content: message.content,
                sentAt: message.sentAt,
            });
        }
    });

    const result = conversations.map((conv) => ({
        id: conv.id,
        participants: Array.from(participantsMap.get(conv.id) ?? []),
        lastMessage: lastMessagesMap.get(conv.id)?.content ?? null,
        createdAt: conv.createdAt,
    }));

    return c.json({
        success: true,
        data: result,
    });
});

conversation.post(
    "/create",
    zValidator("json", CreateConversationSchema),
    async (c) => {
        const { name, participants } = c.req.valid(
            "json",
        ) as CreateConversationType;

        try {
            // Crée la conversation
            const [newConversation] = await db
                .insert(conversationTable)
                .values({ name })
                .returning();

            // Insère les participants dans `is_in`
            await db.insert(isInTable).values(
                participants.map((p) => ({
                    id_conversations: newConversation.id,
                    from: p.from,
                    to: p.to,
                })),
            );

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
