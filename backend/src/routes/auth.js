import express from 'express';
import { userLogin, adminLogin, getCurrentUser } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';
import { validateLogin } from '../middleware/validation.js';

const router = express.Router();

// This will be accessible at: /api/login
router.post('/login', validateLogin, userLogin);

// This will be accessible at: /api/admin-login
router.post('/admin-login', validateLogin, adminLogin);

// This will be accessible at: /api/me
router.get('/me', verifyToken, getCurrentUser);

export default router;
