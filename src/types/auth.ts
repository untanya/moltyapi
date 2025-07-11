import * as z from "zod/v4";

export const signInSchema = z.object({
    name: z.string().min(3),
    password: z.string().min(8),
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

export const deviceSignUpSchema = z.object({
    user_id: z.number().min(1),
    token: z.string(),
    platform: z.string(),
    device_name: z.string(),
    app_version: z.string(),
});

export const jwtPayloadSchema = z
    .object({
        sub: z.string(),
        name: z.string(),
        iat: z.number().int().min(0),
        exp: z.number().int().min(0),
    })
    .refine(
        ({ iat, exp }) => iat <= exp,
        "invalid range, iat is greater than exp",
    );

export type signinType = z.infer<typeof signInSchema>;
export type signupType = z.infer<typeof signUpSchema>;
export type jwtPayloadType = z.infer<typeof jwtPayloadSchema>;
export type deviceSignupType = z.infer<typeof deviceSignUpSchema>;
