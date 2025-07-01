import * as z from "zod/v4"
import { Timestamp } from "./common"

const BaseSchema = z.object({
    from: z.number().min(1),
    to: z.number().min(1),
    id_conversations: z.number()
})

export const IsInSchema = z.intersection(BaseSchema, Timestamp)

export type IsInType = z.infer<typeof IsInSchema>