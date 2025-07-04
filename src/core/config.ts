import * as z from "zod";

const envSchema = z.object({
    DB_FILE_NAME: z.string(),
    JWT_PUBLIC_KEY_X: z.string(),
    JWT_PRIVATE_KEY_D: z.string(),
    AUTH_ENABLED: z.enum(["true", "false"]).default("true"),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
