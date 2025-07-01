import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import auth from "../routes/auth";
import conversation from "../routes/conversation";
import message from "../routes/messages";
import user from "../routes/users";
import { env } from "./config";

const app = new Hono();

app.use(logger());
app.use(cors());
app.use(prettyJSON());

app.get("/", (c) => {
    return c.json(env);
});

app.route("/auth", auth);
app.route("/", conversation);
app.route("/", message);
app.route("/auth", user);

export default app;
