import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRouter from './routes/authRouter.js';
import homeRouter from './routes/homeRouter.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use(authRouter);
app.use(homeRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('The server is listening on ' + PORT + '.'));