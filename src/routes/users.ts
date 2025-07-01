import { Context, Hono } from "hono";
import db from "../dbConnector";

const app = new Hono()


app.post('/users', (c: Context) => {
    return c.json({ success: true, message: "fetch users !" })
})