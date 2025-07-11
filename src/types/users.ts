import * as z from "zod/v4";
import { Timestamp } from "./common";

const BaseSchema = z.object({
    id: z.number().min(1),
    name: z.string(),
    email: z.email(),
    password: z.string(),
    token: z.number().min(1),
});

export const UserSchema = z.intersection(BaseSchema, Timestamp);

export type UserType = z.infer<typeof UserSchema>;
