import * as z from "zod/v4";

export const Timestamp = z.object({
    created_at: z.iso.datetime({ offset: true }),
    updated_at: z.iso.datetime({ offset: true }).optional(),
});
