import mongoose from "mongoose";
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
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const localDate = currentDate.toISOString().split('T')[0]; 
    const appointments = await Appointment.find({ patientId: userId, date: { $gt: localDate }  }).populate(
      "doctorId"
    );
    return res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
}

export async function handleGetMyAppointments(req, res) {
  try {
    const doctorId = req.user._id;
    const user = await User.findById(doctorId);
    if (!user) return res.status(400).json({ msg: "No user found" });
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const localDate = currentDate.toISOString().split('T')[0]; 
    const appointments = await Appointment.find({ doctorId: doctorId, date:{ $gt: localDate }  })
      .populate("doctorId") 
      .populate("patientId");

    return res.status(200).json(appointments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
}
export async function handleScheduleAppointment(req, res) {
  try {
    const { timeFrom, timeTo, date, patientId, appointmentId } = req.body;
    const doctorId = req.user._id;

    const appointment = await Appointment.findByIdAndUpdate(
      {_id: appointmentId},
      {
        $set: {
          timeFrom,
          timeTo,
          date,  
          status: "scheduled"// Update doctorId if required
        }
      },
      { new: true } // Option to return the updated document
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    return res.status(200).json({ message: 'Appointment updated successfully', appointment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function handleCancelAppointment(req, res) {
  try {
    const { appointmentId } = req.body;
    const doctorId = req.user._id;

    const appointment = await Appointment.findOne({ 
      _id: appointmentId,
      doctorId: doctorId 
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found or doctor doesn't have access to this appointment" });
    }

   
    appointment.status = 'canceled';
    

    await appointment.save();

    return res.status(200).json({ message: "Appointment canceled successfully", appointment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error occurred while canceling the appointment", error: error.message });
  }
}
