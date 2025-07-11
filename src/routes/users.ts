import { type Context, Hono } from "hono";
import db from "../core/dbConnector";
import { userTable } from "../db/schema";

const user = new Hono();

user.get("/data", async (c: Context) => {
    try {
        const users = await db
            .select({
                id: userTable.id,
                username: userTable.name,
                created_at: userTable.created_at,
            })
            .from(userTable);

        return c.json({
            success: true,
            message: "You get all your users!",
            data: users,
        });
    } catch (error) {
        console.error("Fetch users error:", error);
        return c.json(
            {
                success: false,
                message: "You have servor error while trying to get users",
            },
            500,
        );
    }
});

export default user;
