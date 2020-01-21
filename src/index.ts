import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

import UserRouter from './route/user-route';

const app = express();

app.use(express.json());
app.use('/users', UserRouter);
app.use(cors());

app.use('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('hello');
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`listening in ${process.env.SERVER_PORT}...`);
});
