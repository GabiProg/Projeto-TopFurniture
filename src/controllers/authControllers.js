import { db } from '../dbStrategy/mongo.js';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import joi from 'joi';

export async function SignIn (req, res){
    const {name, email, password, passwordConfirm } = req.body;

    const userSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required().min(6),
        passwordConfirm: joi.string().required().min(6)
    });

    const validation = userSchema.validate(req.body, {abortEarly: false});
    
    if(validation.error){
        const erros = validation.error.details.map(detail => detail.message);
        res.status(422).send(erros);
        return;
    }

    if(password !== passwordConfirm){
        return res.status(409).send('Por favor, confirme a senha corretamente.');
    }

    try{
        const findUser = await db.collection('usuariosCadastrados').findOne({email});
        if(findUser){
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
    if(validation.error){
        const erros = validation.error.details.map(detail => detail.message);
        res.status(422).send(erros);
        return;
    }

    try {
        const findUser = await db.collection('usuariosCadastrados').findOne({email});

        if(findUser && bcrypt.compareSync(password, findUser.password)){
            const token = uuid();

            await db.collection('sessoes').insertOne({
                token,
                userId: findUser._id
            });

            res.status(201).send({token});

        } else {
            res.status(401).send('Senha ou email incorretos.');
        }

    } catch (err) {
        res.sendStatus(500);
    }
}