import { AiOutlineSchedule } from "react-icons/ai";
import { GiSandsOfTime } from "react-icons/gi";
import { TbCancel } from "react-icons/tb";
import { useAuth } from "../store/useAuth";
import { useEffect, useState } from "react";
import Appointment from "../components/Appointment";
import { formatTime } from "../store/formatTime";
import axios from "axios";
import toast from "react-hot-toast";

export function DoctorPage() {
  const { user, logout, fetchDoctorAppointments, doctorAppointments } =
    useAuth();
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [stats, setStats] = useState({
    scheduled: 0,
    pending: 0,
    canceled: 0,
  });

  useEffect(() => {
    if (selectedAppointment) {
      const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
      if (modal) {
        modal.showModal();
      }
    }
  }, [selectedAppointment]);

  const handleScheduleClick = (appointment: any) => {
    setSelectedAppointment(appointment);
  };

  useEffect(() => {
    fetchDoctorAppointments();
  }, []);

  useEffect(() => {
    if (doctorAppointments?.length > 0) {
      const newStats = doctorAppointments.reduce(
        (acc, appointment) => {
          if (appointment.status === "scheduled") {
            acc.scheduled += 1;
          } else if (appointment.status === "pending") {
            acc.pending += 1;
          } else if (appointment.status === "canceled") {
            acc.canceled += 1;
          }
          return acc;
        },
        { scheduled: 0, pending: 0, canceled: 0 }
      );
      setStats(newStats);
    }
  }, [doctorAppointments]);

  const handleCancelAppointment = async (id: any) => {
    try {
      const res = await axios.put(
        "http://localhost:9294/api/appointment/cancel-appointment",
        { appointmentId: id },
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success("Canceled This Appointment");
        fetchDoctorAppointments();
      }
    } catch (error: any) {
      toast.error(error?.message || "Error occurred while canceling");
    }
  };

  return (
    <div className="mx-40 my-6 space-y-6">
      <div className="navbar bg-black text-white px-4 py-4 shadow-lg rounded-3xl">
        <div className="flex-1">
          <a className="text-2xl font-bold tracking-wide transition duration-300">
            HealthLink
          </a>
        </div>
        <div className="flex-none flex items-center gap-4">
          <div className="text-lg font-medium">Dr. {user?.fullName}</div>
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
            <img
              alt="Doctor profile"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Logout Button */}
          <button
            onClick={logout}
            className="text-lg font-medium bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="text-5xl text-white font-bold">
        Welcome Dr. {user?.fullName}👋
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className="stat-card flex flex-col gap-6 rounded-xl text-white p-6 shadow-lg"
          style={{
            background: "linear-gradient(135deg, #000000, #434343)",
            backgroundSize: "cover",
          }}
        >
          <div className="flex items-center gap-4">
            <AiOutlineSchedule className="text-4xl text-success" />
            <h2 className="text-3xl font-bold">{stats.scheduled}</h2>
          </div>
          <p className="text-lg">Scheduled appointments</p>
        </div>

        <div
          className="stat-card flex flex-col gap-6 rounded-xl text-white p-6 shadow-lg"
          style={{
            background: "linear-gradient(135deg, #000000, #434343)",
            backgroundSize: "cover",
          }}
        >
          <div className="flex items-center gap-4">
            <GiSandsOfTime className="text-4xl text-warning" />
            <h2 className="text-3xl font-bold">{stats.pending}</h2>
          </div>
          <p className="text-lg">Pending Appointments</p>
        </div>

        <div
          className="stat-card flex flex-col gap-6 rounded-xl text-white p-6 shadow-lg"
          style={{
            background: "linear-gradient(135deg, #000000, #434343)",
            backgroundSize: "cover",
          }}
        >
          <div className="flex items-center gap-4">
            <TbCancel className="text-4xl text-red-500" />
            <h2 className="text-3xl font-bold">{stats.canceled}</h2>
          </div>
          <p className="text-lg">Cancelled appointments</p>
        </div>
      </div>

      <div className="mt-8">
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-white bg-black shadow-md rounded-lg">
            <thead className="border-b-2 border-gray-700">
              <tr>
                <th className="px-4 py-2 text-lg font-semibold">Patient</th>
                <th className="px-4 py-2 text-lg font-semibold">Status</th>
                <th className="px-4 py-2 text-lg font-semibold">Date</th>
                <th className="px-4 py-2 text-lg font-semibold">Time</th>
                <th className="px-4 py-2 text-lg font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {doctorAppointments?.map((appointment) => {
                return (
                  <tr
                    className="border-b border-gray-700"
                    key={appointment._id}
                  >
                    <td className="px-4 py-2 ">
                      {appointment.patientId.fullName}
                    </td>
                    <td className="px-4 py-2">
                      <div
                        className={`badge ${
                          appointment.status === "scheduled"
                            ? "badge-success"
                            : appointment.status === "pending"
                            ? "badge-warning"
                            : appointment.status === "canceled"
                            ? "badge-error" 
                            : "badge-info"
                        } gap-2`}
                      >
                        {appointment.status}
                      </div>
                    </td>
                    <td className="px-4 py-2">{appointment.date}</td>
                    <td className="px-4 py-2">
                      {formatTime(appointment.timeFrom)} -{" "}
                      {formatTime(appointment.timeTo)}
                    </td>
                    {appointment.status === "scheduled" ? (
                      <td className="px-4 py-2 flex gap-3 items-center justify-center">
                        <button
                          className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
                          onClick={() =>
                            handleCancelAppointment(appointment._id)
                          }
                        >
                          Cancel
                        </button>
                      </td>
                    ) : (
                      <td className="px-4 py-2 flex gap-3 items-center justify-center">
                        <button
                          className="px-4 py-2 text-white bg-green-600 rounded-lg"
                          onClick={() => handleScheduleClick(appointment)}
                        >
                          Schedule
                        </button>
                        <button className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition">
                          Cancel
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
              {/* Modal */}
              <dialog id="my_modal_3" className="modal">
                <div className="modal-box">
                  <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                      ✕
                    </button>
                  </form>
                  <div>
                    {selectedAppointment && (
                      <Appointment
                        patientId={selectedAppointment.patientId._id}
                        appointmentId={selectedAppointment._id}
                        patientName={selectedAppointment.patientId.fullName}
                        date={selectedAppointment.date}
                        timeFrom={selectedAppointment.timeFrom}
                        timeTo={selectedAppointment.timeTo}
                        description={selectedAppointment.description}
                        selectedAppointment={selectedAppointment}
                      />
                    )}
                  </div>
                </div>
              </dialog>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
