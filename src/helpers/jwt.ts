import { createPrivateKey, createPublicKey, type KeyObject } from "node:crypto";
import { decode, sign, verify } from "hono/jwt";
import type { SignatureKey } from "hono/utils/jwt/jws";
import type { JWTPayload } from "hono/utils/jwt/types";
import { env } from "../core/config";

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

    public async sign(payload: {
        sub: string;
        exp: number;
        iat: number;
    }): Promise<string> {
        return await sign(payload, this.privateKey as SignatureKey, "EdDSA");
    }

    public async verify(token: string): Promise<JWTPayload> {
        return await verify(token, this.publicKey as SignatureKey, "EdDSA");
    }

    public decode(token: string) {
        const { header, payload } = decode(token);
        return [header, payload];
    }
}
