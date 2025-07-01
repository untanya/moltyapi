import { zValidator } from "@hono/zod-validator";
import bcrypt from "bcryptjs";
import { eq, or } from "drizzle-orm";
import { type Context, Hono } from "hono";
import db from "../core/dbConnector";
import { userTable } from "../db/schema";
import { JWT } from "../helpers/jwt";
import { signInSchema, signUpSchema } from "../types/auth";
import { JWT } from "../helpers/jwt";

const auth = new Hono();
const jwt = new JWT();

auth.post("/signin", zValidator("json", signInSchema), async (c) => {
    try {
        const { name, password } = c.req.valid("json");

        const [user] = await db
            .select()
            .from(userTable)
            .where(eq(userTable.name, name));
        if (!user) {
            return c.json({ success: false, message: "User not found" }, 404);
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return c.json({ success: false, message: "Invalid password" }, 401);
        }

        const now = Math.floor(Date.now() / 1000);

        return c.json({
            success: true,
            message: "Sign in ok!",
            refresh_token: await jwt.sign({
                sub: user.id.toString(),
                exp: now + 60 * 60 * 24 * 7,
                iat: now,
            }),
            access_token: await jwt.sign({
                sub: user.id.toString(),
                exp: now + 60 * 60,
                iat: now,
            }),
        });
    } catch {
        return c.json(
            {
                success: false,
                message: "Servor error",
            },
            500,
        );
    }
});

auth.post("/signup", zValidator("json", signUpSchema), async (c) => {
    try {
        const { name, email, password, passwordVerify } = c.req.valid("json");

        if (password !== passwordVerify) {
            return c.json(
                {
                    success: false,
                    message: "Passwords do not match",
                },
                400,
            );
        }

        // Vérifie si le nom OU email existe déjà
        const existingUser = await db
            .select()
            .from(userTable)
            .where(or(eq(userTable.name, name), eq(userTable.email, email)));

        if (existingUser.length > 0) {
            return c.json(
                {
                    success: false,
                    message: "User already exists",
                },
                409,
            );
        }

        // Hash du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertion en BDD
        const insertResult = await db
            .insert(userTable)
            .values({
                name,
                email,
                password: hashedPassword,
            })
            .returning();

        const newUser = insertResult[0];
        const now = Math.floor(Date.now() / 1000);

        // Génération des tokens
        return c.json({
            success: true,
            message: "Sign up is ok!",
            access_token: await jwt.sign({
                sub: newUser.id.toString(),
                exp: now + 60 * 60, // 1h
                iat: now,
            }),
            refresh_token: await jwt.sign({
                sub: newUser.id.toString(),
                exp: now + 60 * 60 * 24 * 7, // 7 jours
                iat: now,
            }),
        });
    } catch (e) {
        console.error("signup error", e);
        return c.json(
            {
                success: false,
                message: "Server error",
            },
            500,
        );
    }
});

auth.post("/token/rotate", (c: Context) => {
    return c.json({ success: true, message: "rotated token !" });
});

export default auth;
