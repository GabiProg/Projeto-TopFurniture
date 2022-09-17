import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRouter from './routes/authRouter.js';
import homeRouter from './routes/homeRouter.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use(authRouter);
app.use(homeRouter);

app.listen(PORT, () => console.log(`The server is listening on ${PORT}`));