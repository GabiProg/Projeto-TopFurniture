import { db } from '../dbStrategy/mongo.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import joi from 'joi';

dotenv.config();

export async function SignIn (req, res){
    const {name, email, password, passwordConfirm } = req.body;

    const userSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required().min(6),
        passwordConfirm: joi.string().required().min(6)
    });

    const validation = userSchema.validate(req.body, {abortEarly: false});
    
    if (validation.error) {
        const erros = validation.error.details.map(detail => detail.message);
        res.status(422).send(erros);
        return;
    }

    if (password !== passwordConfirm) {
        return res.status(409).send('Por favor, confirme a senha corretamente.');
    }

    try{
        const findUser = await db.collection('usuariosCadastrados').findOne({email});
        if (findUser) {
           return res.status(409).send('O usuário já está cadastrado.');
        }

        const cryptoPassword = bcrypt.hashSync(password, 10);
        const cryptopasswordConfirm = bcrypt.hashSync(passwordConfirm, 10);

        await db.collection('usuariosCadastrados').insertOne({
            name,
            email,
            password: cryptoPassword,
            passwordConfirm: cryptopasswordConfirm
        });

        res.status(201).send('Usuário cadastrado.');

    } catch (err) {
        res.sendStatus(500);
    }
}

export async function SingUp (req, res) {
    const { email, password } = req.body;

    const userSchema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required().min(6)
    });
    
    const validation = userSchema.validate(req.body, {abortEarly: false});
    
    if (validation.error) {
        const erros = validation.error.details.map(detail => detail.message);
        res.status(422).send(erros);
        return;
    }

    try {
        const chaveSecreta = process.env.JWT_SECRET;
        
        const findUser = await db.collection('usuariosCadastrados').find({email: `${email}`});
       
        const dados = {userId: findUser._id};
        const token = jwt.sign(dados, chaveSecreta);

        if (findUser && bcrypt.compareSync(password, findUser.password)) {

            await db.collection('sessoes').insertOne({
                token,
                userId: findUser._id
            });

            res.status(201).send({token: token, name: findUser.name});

        } else {
            res.status(401).send('Senha ou email incorretos.');
        }

    } catch (err) {
        res.sendStatus(500);
    }
}