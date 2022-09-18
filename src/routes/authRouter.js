import { SignIn, SingUp } from '../controllers/authControllers.js';
import { Router } from 'express';

const router = Router();

router.post('/sign-in', SignIn);
router.post('/sign-up', SingUp);

export default router;