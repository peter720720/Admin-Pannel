import express from 'express';
import { createUser, getAllUsers, updateUser, deleteUser, adjustBalance } from '../controllers/adminController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import { validateSignup } from '../middleware/validation.js';

const router = express.Router();

// Create User (Admin only)
router.post('/create-user', verifyToken, isAdmin, validateSignup, createUser);

// Get All Users (Admin only)
router.get('/users', verifyToken, isAdmin, getAllUsers);

// Update User (Admin only)
router.put('/users/:id', verifyToken, isAdmin, updateUser);

router.post('/adjust-balance', verifyToken, isAdmin, adjustBalance);

// Delete User (Admin only)
router.delete('/users/:id', verifyToken, isAdmin, deleteUser);

export default router;
