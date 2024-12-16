import express from 'express'
import { protectRoute } from '../lib/protectRoute.js';
import { handleCancelAppointment, handleCreateAppointment, handleGetDoctor, handleGetMyAppointments, handleGetUpcomingAppointments, handleScheduleAppointment } from '../controllers/appointment.js';
const router = express.Router();
router.post("/create", protectRoute,handleCreateAppointment)
router.get("/search-doctor/:query",protectRoute, handleGetDoctor)
router.get("/upcoming-appointments", protectRoute,handleGetUpcomingAppointments)
router.get("/my-appointments", protectRoute, handleGetMyAppointments);
router.put("/reshedule-appointment",protectRoute, handleScheduleAppointment)
router.put("/cancel-appointment", protectRoute, handleCancelAppointment);
export default router