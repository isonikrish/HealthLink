import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiCalendar } from "react-icons/fi";
import { useAuth } from "../store/useAuth";
import { formatTime } from "../store/formatTime";
import axios from "axios";
import toast from "react-hot-toast";

type AppointmentProps = {
  patientId: number;
  patientName: string;
  appointmentId: string;
  date: string;
  timeFrom: Date;
  timeTo: Date;
  description: string;
} & appointmentRefresh;

type appointmentRefresh = {
  selectedAppointment: AppointmentProps | null;
};

function Appointment({
  patientId,
  patientName,
  appointmentId,
  date,
  timeFrom,
  timeTo,
  description,
  selectedAppointment,
}: AppointmentProps) {
  const [formData, setFormData] = useState({
    date: date,
    timeFrom: timeFrom,
    timeTo: timeTo,
    patientId: patientId,
    appointmentId: appointmentId,
  });
  const {fetchDoctorAppointments} = useAuth();
  useEffect(() => {
    if (selectedAppointment) {
      console.log("Selected Appointment:", selectedAppointment);
      setFormData({
        date: selectedAppointment.date,
        timeFrom: new Date(selectedAppointment.timeFrom),
        timeTo: new Date(selectedAppointment.timeTo),
        patientId: selectedAppointment.patientId,
        appointmentId: selectedAppointment._id, // Make sure this uses selectedAppointment._id
      });
    }
  }, [selectedAppointment]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTimeChange = (name: "timeFrom" | "timeTo", time: Date | null) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: time,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);

    try {
      const res = await axios.put(
        "http://localhost:9294/api/appointment/reshedule-appointment",
        formData,
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        toast.success("Re-scheduled the Appointment");
        fetchDoctorAppointments()
      }
    } catch (error: any) {
      toast.error(error?.message || "Error occurred while rescheduling");
    }
  };

  return (
    <div className="p-10 w-full">
      <div className="card w-full shadow-xl rounded-lg">
        <h2 className="card-title text-center text-2xl font-semibold mb-6 text-white">
          View Appointment
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="relative">
            <div className="input input-bordered flex items-center gap-2">
              <input
                type="text"
                className="grow"
                placeholder="Search Doctor"
                value={patientName}
                disabled
              />
            </div>
          </div>

          <div className="relative">
            <textarea
              className="textarea textarea-bordered w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Appointment Description"
              name="description"
              value={description}
              disabled
            />
          </div>

          <div className="relative">
            <FiCalendar className="absolute left-3 top-4 text-gray-400" />
            <input
              type="date"
              className="input input-bordered w-full pl-10 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-between gap-4">
            <div className="flex flex-col">
              <label className="text-gray-500 mb-1">From</label>
              <DatePicker
                selected={formData.timeFrom}
                onChange={(time) => handleTimeChange("timeFrom", time)}
                showTimeSelect
                timeIntervals={15}
                timeCaption="Time"
                showTimeSelectOnly
                dateFormat="h:mm aa"
                className="input input-bordered w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-500 mb-1">To</label>
              <DatePicker
                selected={formData.timeTo}
                onChange={(time) => handleTimeChange("timeTo", time)}
                showTimeSelect
                timeIntervals={15}
                timeCaption="Time"
                showTimeSelectOnly
                dateFormat="h:mm aa"
                className="input input-bordered w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full bg-green-500 hover:bg-green-600 border-none text-white font-bold py-2 px-4 rounded-lg"
          >
            Schedule
          </button>
        </form>
      </div>
    </div>
  );
}

export default Appointment;
