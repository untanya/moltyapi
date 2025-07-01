import { Context, Hono } from "hono";
import db from "../dbConnector";

const auth = new Hono()


auth.post('/signin' ,(c: Context) => {
  return c.json({ success: true, message: "sign in !" })
})

auth.post('/signup', (c: Context) => {
  return c.json({ success: true, message: "sign up !" })
})

auth.post('/token/rotate', (c: Context) => {
  return c.json({ success: true, message: "rotated token !" })
})

export default auth;