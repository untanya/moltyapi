import { Hono } from "hono";
import { cors } from "hono/cors";
import type { JwtVariables } from "hono/jwt";
import { logger } from "hono/logger";
import { authMiddleware } from "../middleware/auth";
//import { prettyJSON } from "hono/pretty-json";
import auth from "../routes/auth";
import conversation from "../routes/conversation";
import message from "../routes/messages";
import user from "../routes/users";
import { env } from "./config";

type Variables = JwtVariables;

const app = new Hono<{ Variables: Variables }>();

// Middlewares
app.use(logger());
app.use(cors());
if (env.AUTH_ENABLED === "true") {
    app.use("*", authMiddleware);
}

app.use();

// Test route
app.get("/", (c) => c.json(env));

// Routes
app.route("/auth", auth); // /auth/signin, /auth/signup
app.route("/conversations", conversation); // /conversations/*
app.route("/messages", message); // /messages/*
app.route("/users", user); // /users/* (par ex. GET /users)

export default app;
