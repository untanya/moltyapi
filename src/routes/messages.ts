import { Context, Hono } from "hono";
import db from "../dbConnector";

const app = new Hono()


app.post('/message/send', (c: Context) => {
    return c.json({ success: true, message: "created message !" })
})

app.get('/message/:id', (c: Context) => {
    const id = c.req.param("id")
    return c.json({ success: true, message: "fetch message !" })
})

app.get('/messages', (c: Context) => {
    return c.json({ success: true, message: "fetch messages !" })
})