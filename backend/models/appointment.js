import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    timeFrom: {
        type: String,
        required: true
    },
    timeTo: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "scheduled", "completed", "canceled"],
        default: "pending"
    }

}, {timestamps: true})

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;