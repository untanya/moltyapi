import { type Context, Hono } from "hono";

const message = new Hono();

message.post("/message/send", (c: Context) => {
    return c.json({ success: true, message: "created message !" });
});

message.get("/message/:id", (c: Context) => {
    const _id = c.req.param("id");
    return c.json({ success: true, message: "fetch message !" });
});

message.get("/messages", (c: Context) => {
    return c.json({ success: true, message: "fetch messages !" });
});

export default message;
