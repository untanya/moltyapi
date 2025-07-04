import * as z from "zod/v4";
import { Timestamp } from "./common";

const BaseSchema = z.object({
    id: z.number().min(1),
    content: z.string(),
    deleted: z.boolean(),
    id_users: z.number(),
    id_conversations: z.number(),
});

export const CreateMessageSchema = BaseSchema.pick({
    content: true,
    id_users: true,
    id_conversations: true,
}).loose();

export const MessageSchema = z.intersection(BaseSchema, Timestamp);

export type MessageType = z.infer<typeof MessageSchema>;
export type CreateMessageType = z.infer<typeof CreateMessageSchema>;
