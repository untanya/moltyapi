import { zValidator } from "@hono/zod-validator";
import { type Context, Hono } from "hono";
import { signInSchema, signUpSchema } from "../types/auth";
import { JWT } from "../helpers/jwt";

const auth = new Hono();
const jwt = new JWT();

auth.post("/signin", zValidator("json", signInSchema), async (c) => {
    try {
        const { name, password } = c.req.valid("json");


        if (name === "Viniew" && password === "mdptest") {
            const now = Math.floor(Date.now() / 1000);
            return c.json({
                success: true,
                message: "Sign in ok!",
                refreh_token: await jwt.sign({ sub: "Viniew", exp: now + 60 * 60 * 24 * 7, iat: now }),
                access_token: await jwt.sign({ sub: "Viniew", exp: now + 60 * 60, iat: now })
            });
        } else {
            return c.json(
                {
                    success: false,
                    message: "Invalid connection",
                },
                401,
            );
        }
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

        if (
            name === "Viniew" &&
            email === "test@test.fr" &&
            password === "testing123" &&
            passwordVerify === "testing123"
        ) {
            return c.json({
                success: true,
                message: "Sign up is ok!",
                token: "Token je te donne si je veux",
            });
        } else {
            return c.json(
                {
                    success: false,
                    message: "Invalid input",
                },
                401,
            );
        }
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

auth.post("/token/rotate", (c: Context) => {
    return c.json({ success: true, message: "rotated token !" });
});

export default auth;
