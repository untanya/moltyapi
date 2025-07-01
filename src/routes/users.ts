import { Context, Hono } from "hono";
import db from "../dbConnector";

const user = new Hono()


user.get('/users', (c: Context) => {
    return c.json({ success: true, message: "fetch users !" })
})

export default user;