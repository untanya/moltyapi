import express, { type Request, type Response, type Application } from 'express';

// Initialisez l'application Express
const app: Application = express();

// Définissez une route GET
app.get("/", (req: Request, res: Response) => {
    res.send("Bonjour le monde...");
});

// Définissez une route POST
app.post('/', (req: Request, res: Response) => {
    res.send('Got a POST request');
});

// Définissez une route PUT
app.put('/user', (req: Request, res: Response) => {
    res.send('Got a PUT request at /user');
});

// Définissez une route DELETE
app.delete('/user', (req: Request, res: Response) => {
    res.send('Got a DELETE request at /user');
});

