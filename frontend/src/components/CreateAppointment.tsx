import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiCalendar } from "react-icons/fi";
import { useAuth } from "../store/useAuth";

function CreateAppointment() {
  const { createAppointment, fetchDoctor, doctors } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>(""); // Real-time input
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    doctorId: "",
    description: "",
    date: "",
    timeFrom: null as Date | null,
    timeTo: null as Date | null,
  });

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Debounce the search query
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch doctors based on debounced query
  useEffect(() => {
    if (debouncedQuery) {
      fetchDoctor(debouncedQuery);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [debouncedQuery, fetchDoctor]);

  // Handle time selection
  const handleTimeChange = (name: "timeFrom" | "timeTo", time: Date | null) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: time,
    }));
  };

  const handleDoctorSelect = (doctorId: string) => {
    setFormData((prevState) => ({
      ...prevState,
      doctorId,
    }));
    setShowDropdown(false);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await createAppointment(formData); 
    setIsLoading(false);
  };


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="p-10 w-full">
      <div className="card w-full shadow-xl rounded-lg">
        <h2 className="card-title text-center text-2xl font-semibold mb-6 text-white">
          Create a New Appointment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <div className="input input-bordered flex items-center gap-2">
              <input
                type="text"
                className="grow"
                placeholder="Search Doctor"
                onChange={handleSearch}
              />
            </div>
            {showDropdown && (
              <ul className="absolute bg-black border rounded-lg w-full mt-1 shadow-lg max-h-60 overflow-y-auto z-10">
                {doctors?.map((doctor) => (
                  <li
                    key={doctor?._id}
                    className={`px-4 py-2 cursor-pointer hover:bg-blue-100 hover:text-black ${
                      formData.doctorId === doctor?._id ? "bg-blue-200" : ""
                    }`}
                    onClick={() => handleDoctorSelect(doctor?._id)}
                  >
                    {doctor?.fullName} - {doctor?.email}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="relative">
            <textarea
              className="textarea textarea-bordered w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Appointment Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Appointment Date */}
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

          {/* Time Selection */}
          <div className="flex justify-between gap-4">
            <div className="flex flex-col">
              <label className="text-gray-500 mb-1">From</label>
              <DatePicker
                selected={formData.timeFrom}
                onChange={(time: Date | null) => handleTimeChange("timeFrom", time)}
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
                onChange={(time: Date | null) => handleTimeChange("timeTo", time)}
                showTimeSelect
                timeIntervals={15}
                timeCaption="Time"
                showTimeSelectOnly
                dateFormat="h:mm aa"
                className="input input-bordered w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200"
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner"></span> Loading...
              </>
            ) : (
              "Create Appointment"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateAppointment;
