import { create } from "zustand";
import { loginUser, User, Loggeduser, appointment, doctor, finalAppointment, doctorsAppointment } from "./types.ts";
import axios from "axios";
import toast from "react-hot-toast";

interface AuthState {
  user: Loggeduser | null;
  isSigningUp: boolean;
  isLogging: boolean;
  signup: (data: User) => void;
  login: (data: loginUser) => void;
  logout: () => void;
  fetchMe: () => void;
  createAppointment: (data: appointment) => void;
  fetchDoctor: (query: string) => void;
  doctors: doctor[] | null
  appointments: finalAppointment[] | null
  doctorAppointments: doctorsAppointment[] |null
  fetchAppointments: ()=>void;
  fetchDoctorAppointments: ()=>void;
}

export const useAuth = create<AuthState>((set,get) => ({
  user: null,
  isSigningUp: false,
  isLogging: false,
  doctors: null,
  appointments: null,
  doctorAppointments: null,
  signup: async (data: User) => {
    set({ isSigningUp: true });
    try {
      const res = await axios.post(
        "http://localhost:9294/api/user/signup",
        data,
        {
          withCredentials: true,
        }
      );
      set({ user: res.data });
      toast.success("Account created successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.msg || "An error occurred");
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data: loginUser) => {
    set({ isLogging: true });
    try {
      const res = await axios.post(
        "http://localhost:9294/api/user/login",
        data,
        {
          withCredentials: true,
        }
      );
      set({ user: res.data });
      toast.success("Logged In");
    } catch (error: any) {
      toast.error(error.response?.data?.msg || "An error occurred");
    } finally {
      set({ isLogging: false });
    }
  },
  fetchMe: async () => {
    try {
      const res = await axios.get("http://localhost:9294/api/user/me", {
        withCredentials: true,
      });
      set({ user: res.data });
    } catch (error) {
      console.log(error);
    }
  },
  logout: async () => {
    try {
      const res = await axios.post(
        "http://localhost:9294/api/user/logout",
        {},
        {
          withCredentials: true,
        }
      );
      if(res.status === 200){
        toast.success("Logged Out Successfully");
        set({ user: null });
      }
      
    } catch (error: any) {
      toast.error(error.response?.data?.msg || "An error occurred");
    }
  },
  
  createAppointment: async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:9294/api/appointment/create",
        data,
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        toast.success("New Appointment Created");
      }
    } catch (error) {
      toast.error("Error creating appointment");
    }
  },
  fetchDoctor: async(query: string) =>{
    try {
      const res = await axios.get(`http://localhost:9294/api/appointment/search-doctor/${query}`,{
        withCredentials: true
      })
      set({doctors: res.data})


    } catch (error) {
      console.log(error)
    }
  },
  fetchAppointments: async () => {
    try {
      const res = await axios.get("http://localhost:9294/api/appointment/upcoming-appointments", {
        withCredentials: true,
      });
      set({ appointments: res.data });
    } catch (error) {
      console.log(error);
    }
  },
  fetchDoctorAppointments: async() =>{
    
     try {
      const res = await axios.get("http://localhost:9294/api/appointment/my-appointments", {
        withCredentials: true,
      });
      set({ doctorAppointments: res.data });
    } catch (error) {
      console.log(error);
    }
  }
}));
