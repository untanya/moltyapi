import * as z from "zod/v4";
import { Timestamp } from "./common";

const BaseSchema = z.object({
    id: z.number().min(1),
    user_id: z.number().min(1),
    refresh_token: z.string(),
    platform: z.string(),
    deviceName: z.string(),
    appVersion: z.string(),
});

export const DeviceTokenSchema = z.intersection(BaseSchema, Timestamp);

export type RefreshTokenType = z.infer<typeof DeviceTokenSchema>;
