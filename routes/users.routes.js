// routes/user.routes.js
import express from 'express';
import auth from '../middleware/auth.js';
import {
  register,
  login,
  refresh,
  getAllUsers,
  logout,
} from '../controllers/user.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.get('/users', auth, getAllUsers);
router.post('/logout', auth, logout);

export default router;
