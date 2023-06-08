import express from 'express';
import { loginController, registerController, test } from '../controllers/authController.js';

//router object
const router = express.Router();

//register
router.post('/register',registerController);
router.post('/login', loginController);
router.get('/', test);

export default router;