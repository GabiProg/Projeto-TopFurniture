import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRouter from './routes/authRouter.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use(authRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log('The server is current listening.'));