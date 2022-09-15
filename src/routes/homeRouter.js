import { SendProducts, Checkout } from "../controllers/homeController.js";
import  AuthorizeUser  from "../middlewares/authorizeUser.js";
import { Router } from "express";

const router = Router();

router.get('/home', SendProducts);
router.post('/cart', AuthorizeUser, Checkout);

export default router;

