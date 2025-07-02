import * as z from "zod";

const envSchema = z.object({
    DB_FILE_NAME: z.string(),
    JWT_PUBLIC_KEY_X: z.string(),
    JWT_PRIVATE_KEY_D: z.string(),
});

export const env = envSchema.parse(process.env);

export type env = z.infer<typeof envSchema>;
