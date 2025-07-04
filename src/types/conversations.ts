import * as z from "zod/v4";
import { Timestamp } from "./common";

const BaseSchema = z.object({
    id: z.number().min(1),
    name: z.string(),
});

export const CreateConversationSchema = BaseSchema.pick({
    name: true,
}).loose();

export const ConversationSchema = z.intersection(BaseSchema, Timestamp);

export type ConversationType = z.infer<typeof ConversationSchema>;
export type CreateConversationType = z.infer<typeof CreateConversationSchema>;
