import { Hono } from "hono"
import { logger } from "hono/logger"
import { cors } from "hono/cors"
import { prettyJSON } from 'hono/pretty-json'


const app = new Hono()

app.use(logger())
app.use(cors())
app.use(prettyJSON())

app.get('/', (c) => {
  return c.json("Hello Hono !")
})

export default app;