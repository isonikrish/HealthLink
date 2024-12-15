import { appointmentSchema } from "../lib/zodSchemas.js";
import Appointment from "../models/appointment.js";
import User from "../models/user.js";
export async function handleCreateAppointment(req, res) {
  try {
    const data = req.body;
    const patientId = req.user._id;
    const validatedData = appointmentSchema.safeParse(data);
    if (!validatedData.success) {
      return res.status(400).json({
        msg: "Invalid credentials",
        errors: validatedData.error.errors,
      });
    }
    const { doctorId, description, date, timeFrom, timeTo } =
      validatedData.data;
    const newAppointment = new Appointment({
      doctorId,
      description,
      date,
      timeFrom,
      timeTo,
      patientId,
    });
    await newAppointment.save();
    return res.status(200).json({ msg: "New appoinment created" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error" });
  }
}
export async function handleGetDoctor(req, res) {
  try {
    const { query } = req.params;
    if (!query || query.trim() === "") {
      return res.status(400).json({ msg: "Search query cannot be empty" });
    }
    const doctors = await User.find({
      role: "doctor",
      fullName: { $regex: query, $options: "i" },
    });
    if (doctors.length === 0) {
      return res
        .status(404)
        .json({ msg: "No doctors found matching your query" });
    }
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
}

export async function handleGetUpcomingAppointments(req, res) {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ msg: "No user found" });
    const appointments = await Appointment.find({ patientId: userId }).populate("doctorId");
    return res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
}
