import { Context, Hono } from "hono";
import db from "../dbConnector";

const app = new Hono()


app.get('/conversation/:id', (c: Context) => {
    const id = c.req.param("id")
    return c.json({ success: true, message: `get conversation id: ${id} !` })
})

app.get('/conversations', (c: Context) => {
  return c.json({ success: true, message: "get conversations !" })
})
