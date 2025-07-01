import * as z from "zod/v4";
import { Timestamp } from "./common";

const BaseSchema = z.object({
    id: z.number().min(1),
});

export const ConversationSchema = z.intersection(BaseSchema, Timestamp);

export type ConversationType = z.infer<typeof ConversationSchema>;
