import { zValidator } from "@hono/zod-validator";
import bcrypt from "bcryptjs";
import { eq, or } from "drizzle-orm";
import { Hono } from "hono";
import db from "../core/dbConnector";
import { deviceTokenTable, refreshTokenTable, userTable } from "../db/schema";
import { JWT } from "../helpers/jwt";
import { signInSchema, signUpSchema } from "../types/auth";

const auth = new Hono();
const jwt = new JWT();

auth.post("/user/signin", zValidator("json", signInSchema), async (c) => {
    try {
        const { name, password } = c.req.valid("json");

        const [user] = await db
            .select({
                id: userTable.id,
                name: userTable.name,
                password: userTable.password,
                refresh_token: refreshTokenTable.refresh_token,
            })
            .from(userTable)
            .leftJoin(
                refreshTokenTable,
                eq(userTable.token, refreshTokenTable.id),
            )
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
            access_token: await jwt.sign({
                sub: user.id.toString(),
                exp: now + 60 * 60,
                iat: now,
                name: "",
            }),
            refresh_token: user.refresh_token,
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

auth.post("/user/signup", zValidator("json", signUpSchema), async (c) => {
    try {
        const { name, email, password, passwordVerify } = c.req.valid("json");

        if (password !== passwordVerify) {
            return c.json(
                { success: false, message: "Passwords do not match" },
                400,
            );
        }

        const existingUser = await db
            .select()
            .from(userTable)
            .where(or(eq(userTable.name, name), eq(userTable.email, email)));

        if (existingUser.length > 0) {
            return c.json(
                { success: false, message: "User already exists" },
                409,
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const now = Math.floor(Date.now() / 1000);

        const [newUser] = await db
            .insert(userTable)
            .values({
                name,
                email,
                password: hashedPassword,
            })
            .returning();

        const refreshToken = await jwt.sign({
            sub: newUser.id.toString(),
            exp: now + 60 * 60 * 24 * 7, // 7 jours
            iat: now,
            name: newUser.name,
        });

        const deviceToken = await jwt.sign({
            sub: newUser.id.toString(),
            exp: now + 60 * 60 * 24 * 365 * 1000, // 1000 ans
            iat: now,
            name: newUser.name,
        });

        const [refreshTokenEntry] = await db
            .insert(refreshTokenTable)
            .values({ refresh_token: refreshToken })
            .returning({ id: refreshTokenTable.id });

        const [deviceTokenEntry] = await db
            .insert(deviceTokenTable)
            .values({ device_token: deviceToken })
            .returning({ id: deviceTokenTable.id });

        await db
            .update(userTable)
            .set({
                token: refreshTokenEntry.id,
                device_token: deviceTokenEntry.id,
            });

        const accessToken = await jwt.sign({
            sub: newUser.id.toString(),
            exp: now + 60 * 60, // 1h
            iat: now,
            name: "",
        });

        return c.json({
            success: true,
            message: "Sign up is ok!",
            access_token: accessToken,
            refresh_token: refreshToken,
        });
    } catch (e) {
        console.error("signup error", e);
        return c.json({ success: false, message: "Server error" }, 500);
    }
});

export default auth;
