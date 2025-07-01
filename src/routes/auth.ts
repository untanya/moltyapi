import { Context, Hono } from "hono";
import db from "../dbConnector";

const app = new Hono()


app.get('/signin' ,(c: Context) => {
  return c.json({ success: true, message: "sign in !" })
})

app.get('/signup', (c: Context) => {
  return c.json({ success: true, message: "sign up !" })
})

app.get('/token/rotate', (c: Context) => {
  return c.json({ success: true, message: "rotated token !" })
})