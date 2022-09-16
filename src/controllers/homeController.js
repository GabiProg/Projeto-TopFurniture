import products from '../products/products.json' assert {type: "json"};
import { db } from '../dbStrategy/mongo.js';
import joi from 'joi';

export async function SendProducts (req, res) {
    return res.json(products);
}

export async function Checkout (req, res) {
    const { name, cpf, product, value } = req.body;
    const session = res.locals.session;
  
    const CheckoutSchema = joi.object({
      name: joi.string().required(),
      cpf: joi.number().required(),
      product: joi.array().required(),
      value: joi.number().required()
    });
  
    const validation = CheckoutSchema.validate(req.body, { abortEarly: false });
  
    if (validation.error) {
      const erros = validation.error.details.map((detail) => detail.message);
      res.status(422).send(erros);
      return;
    }
  
    try {
      const getSession = await db.collection('sessoes').findOne({token: session.token});
       
      if (!getSession) {
          return res.status(401).send('Acesso negado.');
      }
  
      await db.collection("vendas").insertOne({
        name,
        cpf,
        product,
        value,
        status: 'Concluída',
        userId: getSession._id 
      });
  
      res.status(201).send("Venda Concluída");
    } catch (err) {
      res.sendStatus(500);
    }
}