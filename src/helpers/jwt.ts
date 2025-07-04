import { decode, sign, verify } from "hono/jwt";
import type { SignatureKey } from "hono/utils/jwt/jws";
import type { JWTPayload } from "hono/utils/jwt/types";
import { env } from "../core/config";
import type { jwtPayloadType } from "../types/auth";

export class JWT {
    private publicKey: SignatureKey;
    private privateKey: SignatureKey;

    constructor() {
        this.publicKey = {
            kty: "OKP",
            crv: "Ed25519",
            x: env.JWT_PUBLIC_KEY_X,
        };

        this.privateKey = {
            kty: "OKP",
            crv: "Ed25519",
            d: env.JWT_PRIVATE_KEY_D,
        };
    }

    /**
     * Signs a JWT using the Ed25519 private key.
     *
     * The `payload` must contain the following standard claims:
     *
     * @param payload - The JWT payload to sign:
     *
     * - `sub` (string): Subject — the unique identifier of the user (e.g. user ID).
     * - `name` (string): Name — identifies the owner of that token (e.g. Robert).
     * - `iat` (number): Issued At — a UNIX timestamp (in seconds) indicating when the token was issued.
     * - `exp` (number): Expiration — a UNIX timestamp (in seconds) indicating when the token should expire.
     *
     * Example usage:
     * ```ts
     * jwt.sign({
     *   sub: "user-123",
     *   iss: "robert",
     *   iat: Math.floor(Date.now() / 1000),
     *   exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
     * });
     * ```
     *
     * @returns A signed JWT as a compact string.
     */
    public async sign(payload: jwtPayloadType): Promise<string> {
        return await sign(payload, this.privateKey as SignatureKey, "EdDSA");
    }

    public async verify(token: string): Promise<JWTPayload> {
        return await verify(token, this.publicKey as SignatureKey, "EdDSA");
    }

    public decode(token: string) {
        const { header, payload } = decode(token);
        return { header, payload };
    }
}
