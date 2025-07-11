import { eq } from "drizzle-orm";
import { type Context, Hono } from "hono";
import db from "../core/dbConnector";
import { deviceTokenTable, userTable } from "../db/schema";

const user = new Hono();

user.get("/data/:id", async (c: Context) => {
    try {
        const id = !Number.isInteger(c.req.param("id"))
            ? Number(c.req.param("id"))
            : undefined;

        if (id) {
            const users = await db
                .select({
                    id: userTable.id,
                    username: userTable.name,
                    deviceToken: deviceTokenTable.deviceToken,
                    created_at: userTable.created_at,
                })
                .from(userTable)
                .rightJoin(
                    deviceTokenTable,
                    eq(deviceTokenTable.user_id, userTable.id),
                )
                .where(eq(userTable.id, id));

            return c.json({
                success: true,
                data: users,
            });
        }
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
