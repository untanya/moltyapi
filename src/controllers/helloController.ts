import type { Request, Response } from "express"

export function hello(_req: Request, res: Response) {
    return res.send("Hello World");
}