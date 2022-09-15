import { db, ObjectId } from '../dbStrategy/mongo.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

async function AuthorizeUser (req, res, next){
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    const chaveSecreta = process.env.JWT_SECRET;

    
    try {
        if (!token) {
            return res.sendStatus(401);
        }

        const dados = jwt.verify(token, chaveSecreta);
        if (!dados) {
            return res.status(401).send('Acesso negado.');
        }
        
        const session = await db.collection('sessoes').findOne({ userId: dados.userId});
        console.log(session);
        if (session === '') {
            return res.status(401).send('Acesso negado.');
        }

        res.locals.session = session;

    } catch (err) {
        res.sendStatus(500);
    }

    next();
} 

export default AuthorizeUser;