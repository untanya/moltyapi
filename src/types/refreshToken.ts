import * as z from "zod/v4"
import { Timestamp } from "./common"

const BaseSchema = z.object({
    id: z.number().min(1),
    refresh_token: z.string(),
})

export const RefreshTokenSchema = z.intersection(BaseSchema, Timestamp)

export type RefreshTokenType = z.infer<typeof RefreshTokenSchema>