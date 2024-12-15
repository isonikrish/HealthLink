import express from 'express'
import { protectRoute } from '../lib/protectRoute.js';
import { handleCreateAppointment, handleGetDoctor, handleGetUpcomingAppointments } from '../controllers/appointment.js';
const router = express.Router();
router.post("/create", protectRoute,handleCreateAppointment)
router.get("/search-doctor/:query",protectRoute, handleGetDoctor)
router.get("/upcoming-appointments", protectRoute,handleGetUpcomingAppointments)
export default router