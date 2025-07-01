import * as z from "zod/v4";

export const signInSchema = z.object({
    name: z.string().min(4),
    password: z.string().min(6),
});

export const signUpSchema = z
    .object({
        name: z.string(),
        email: z.email(),
        password: z.string().min(8),
        passwordVerify: z.string().min(8),
    })
    .refine((data) => data.password === data.passwordVerify, {
        message: "Passwords do not match",
        path: ["passwordVerify"],
    });

export type signinType = z.infer<typeof signInSchema>;
export type signupType = z.infer<typeof signUpSchema>;
