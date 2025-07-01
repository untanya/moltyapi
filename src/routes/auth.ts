import { type Context, Hono } from "hono";

const auth = new Hono();

auth.post("/signin", (c: Context) => {
    return c.json({ success: true, message: "sign in !" });
});

auth.post("/signup", (c: Context) => {
    return c.json({ success: true, message: "sign up !" });
});

auth.post("/token/rotate", (c: Context) => {
    return c.json({ success: true, message: "rotated token !" });
});

export default auth;
