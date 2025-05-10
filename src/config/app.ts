import express, { type Request, type Response, type Application } from 'express';

import dataRoutes from "../routes/dataRoutes"

// Initialisez l'application Express
const app: Application = express();

// Définissez une route GET
app.get("/hello", (_req: Request, res: Response) => {
    res.status(200).send("Bonjour le monde...");
});

app.use("/data", dataRoutes)

// // Définissez une route POST
// app.post('/', (req: Request, res: Response) => {
//     res.send('Got a POST request');
// });

// // Définissez une route PUT
// app.put('/user', (req: Request, res: Response) => {
//     res.send('Got a PUT request at /user');
// });

// // Définissez une route DELETE
// app.delete('/user', (req: Request, res: Response) => {
//     res.send('Got a DELETE request at /user');
// });

export default app;