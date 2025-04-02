import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || "localhost";

app.get('/', (_req, res) => {
  res.send('Hello from MoltyAPI!')
})

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://${HOST}:${PORT}`)
})
