import React, { useEffect, useState } from "react";
import { useAuth } from "../store/useAuth";
import { useNavigate } from "react-router-dom";
interface AuthProps {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

function Login({ setIsLogin }: AuthProps) {
  const {login, fetchMe, user} = useAuth()
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "doctor") {
      navigate(`/doctor/${user?._id}`)
      
    }else if(user?.role === "patient"){
      navigate(`/patient/${user?._id}`)
    }
  }, [user, navigate]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    await login(formData);
    fetchMe()
  };
  return (
    <div className="min-h-screen bg-base-200 flex">
      <div className="flex-1 flex justify-center items-center">
        <div className="card w-full max-w-lg shadow-lg bg-base-100 p-8">
          <h2 className="text-3xl font-bold text-center mb-6">Log In</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="your-email@site.com"
                className="input input-bordered w-full"
                value={formData.email}
                name= "email"
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
                value={formData.password}
                name= "password"
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Log In
            </button>
          </form>
          <p className="text-center text-sm mt-4">
            Don't have an account?{" "}
            <button
              onClick={() => setIsLogin(false)}
              className="text-primary hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
