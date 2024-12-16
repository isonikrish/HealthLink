import { useEffect } from "react";
import CreateAppointment from "../components/CreateAppointment";
import { useAuth } from "../store/useAuth";
import { CiLogout } from "react-icons/ci";

export function PatientPage() {
  const { fetchAppointments, appointments, user, logout } = useAuth();
  useEffect(() => {
    fetchAppointments();
  }, []);

  const openModal = () => {
    const modal = document.getElementById("my_modal_1") as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };
  return (
    <div className="relative p-10">
      <button
        className="fixed top-4 right-4 flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md transition duration-300 z-50 border-white border"
        onClick={logout}
      >
        <CiLogout className="text-xl" />
        Logout
      </button>

      <div className="card bg-gradient-to-r from-primary to-secondary shadow-xl rounded-lg">
        <div className="card-body text-white">
          <div className="flex items-center mb-6">
            <img
              src="https://via.placeholder.com/50"
              alt="Profile"
              className="rounded-full w-16 h-16 mr-6 shadow-md"
            />
            <div>
              <h2 className="text-4xl font-bold">Hello, {user?.fullName}👋</h2>
              <p className="text-lg mt-2">Gender: {user?.gender}</p>
            </div>
          </div>
          <div className="card-actions justify-end mt-4">
            <button className="btn" onClick={openModal}>
              Create Appointment
            </button>
          </div>
          <dialog id="my_modal_1" className="modal">
            <div className="bg-[#101010] p-3 rounded-2xl">
              <div className="w-[700px]">
                <CreateAppointment />
              </div>
              <div className="modal-action">
                <form method="dialog">
                  <button className="btn">Close</button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-3xl font-semibold mb-4 text-white">
          Upcoming Appointments
        </h3>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="border-b-2 border-white">
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Doctor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments?.map((schedule, index) => (
                <tr key={index}>
                  <td>{schedule?.date}</td>
                  <td>
                    {schedule.timeFrom} - {schedule.timeTo}
                  </td>
                  <td>{schedule?.doctorId?.fullName}</td>
                  <td>
                    <span
                      className={`badge ${
                        schedule.status === "scheduled"
                          ? "badge-success"
                          : schedule.status === "pending"
                          ? "badge-warning"
                          : schedule.status === "canceled"
                          ? "badge-error" 
                          : "badge-info"
                      } gap-2`}
                    >

                      {schedule?.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
