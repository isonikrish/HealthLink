import express from 'express'
import { handleLogin, handleLogout, handleSignup } from '../controllers/auth.js';

const router = express.Router();
router.post('/signup', handleSignup)
router.post('/login', handleLogin)
router.post('/logout', handleLogout)
router.get("/me")
export default router