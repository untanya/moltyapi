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

app.use(logger());
app.use(cors());
if (env.AUTH_ENABLED === "true") {
    app.use("*", authMiddleware);
}

app.use();

app.get("/", (c) => {
    return c.json(env);
});

app.route("/auth", auth);
app.route("/", conversation);
app.route("/", message);
app.route("/auth", user);

export default app;
