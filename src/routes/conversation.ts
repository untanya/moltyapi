import { Context, Hono } from "hono";
import db from "../dbConnector";

const conversation = new Hono()


conversation.get('/conversation/:id', (c: Context) => {
    const id = c.req.param("id")
    return c.json({ success: true, message: `get conversation id: ${id} !` })
})

conversation.get('/conversations', (c: Context) => {
  return c.json({ success: true, message: "get conversations !" })
})

export default conversation;