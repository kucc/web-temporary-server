import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('hello');
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`listening in ${process.env.SERVER_PORT}...`);
});
