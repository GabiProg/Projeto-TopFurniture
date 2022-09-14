import { SignIn, SingUp } from '../controllers/authControllers.js';
import { Router } from 'express';

const router = Router();

router.use('/sign-in', SignIn);
router.use('/', SingUp);

export default router;