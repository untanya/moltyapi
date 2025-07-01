import { type Context, Hono } from "hono";

const user = new Hono();

user.get("/users", (c: Context) => {
    return c.json({ success: true, message: "fetch users !" });
});

export default user;
