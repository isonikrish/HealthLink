import { useState } from "react";
import { useAuth } from "../store/useAuth";

interface AuthProps {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

function Signup({ setIsLogin }: AuthProps) {
  const {signup, isSigningUp} = useAuth()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    address: "",
    gender: "",
    role: "doctor",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signup(formData)
    
  };

  return (
    <div className="min-h-screen bg-base-200 flex">
      <div className="flex-1 flex justify-center items-center">
        <div className="card w-full max-w-lg shadow-lg bg-base-100 p-8">
          <h2 className="text-3xl font-bold text-center mb-6">
            Create Your Account
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Daisy"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="daisy@site.com"
                  className="input input-bordered w-full"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="******"
                  className="input input-bordered w-full"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Address</span>
                </label>
                <input
                  type="text"
                  placeholder="123 Main St, City, Country"
                  className="input input-bordered w-full"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Gender</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option disabled value="">
                    Select Gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Role</span>
                </label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="role"
                      className="radio radio-primary"
                      value="doctor"
                      checked={formData.role === "doctor"}
                      onChange={handleInputChange}
                    />
                    <span>Doctor</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="role"
                      className="radio radio-secondary"
                      value="patient"
                      checked={formData.role === "patient"}
                      onChange={handleInputChange}
                    />
                    <span>Patient</span>
                  </label>
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full mt-4">
              Sign Up
            </button>
          </form>
          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <button
              onClick={() => setIsLogin(true)}
              className="text-primary hover:underline"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
