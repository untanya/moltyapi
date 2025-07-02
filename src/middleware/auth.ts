import { eq } from "drizzle-orm";
import type { MiddlewareHandler } from "hono";
import type { JWTPayload } from "hono/utils/jwt/types";
import db from "../core/dbConnector";
import { refreshTokenTable, userTable } from "../db/schema";
import { JWT } from "../helpers/jwt";
import type { jwtPayloadType } from "../types/auth";

export const authMiddleware: MiddlewareHandler = async (c, next) => {
    const authHeader = c.req.header("Authorization");

    if (!authHeader) {
        return c.json(
            { message: "Unauthorized", reason: "Missing access token." },
            401,
        );
    }

    const accessToken = authHeader.replace("Bearer ", "");
    const { sign, decode, verify } = new JWT();

    try {
        const payload = await verify(accessToken);
        c.set("user", payload);
        return await next();
    } catch {
        // access_token invalide → on essaie de récupérer le refresh token en base via sub
        let refreshPayload: jwtPayloadType | JWTPayload;

        try {
            // On parse même access_token invalide pour en extraire le payload.sub (userId)
            refreshPayload = await verify(accessToken); // si partiellement décodable malgré invalide (sinon on fallback)
        } catch {
            // fallback brut : on décode pour extraire sub
            try {
                const { payload } = decode(accessToken);
                refreshPayload = payload;
            } catch {
                return c.json(
                    {
                        message: "Unauthorized",
                        reason: "Invalid access token, and unable to extract user ID.",
                    },
                    401,
                );
            }
        }

        const userId = Number(refreshPayload.sub);

        const [row] = await db
            .select({
                refreshToken: refreshTokenTable.refresh_token,
                userId: userTable.id,
                userName: userTable.name, // ou name si tu veux
            })
            .from(userTable)
            .innerJoin(
                refreshTokenTable,
                eq(userTable.token, refreshTokenTable.id),
            )
            .where(eq(userTable.id, userId));

        if (!row) {
            return c.json(
                {
                    message: "Unauthorized",
                    reason: "User not found.",
                },
                401,
            );
        }

        // ✅ Génération d’un nouveau access_token
        const now = Math.floor(Date.now() / 1000);
        const newAccessToken = await sign({
            sub: String(row.userId),
            name: row.userName,
            iat: now,
            exp: now + 60 * 60, // 1h
        });

        c.header("X-New-Access-Token", newAccessToken);
        c.set("user", { sub: row.userId, name: row.userName });

        return await next();
    }
};
