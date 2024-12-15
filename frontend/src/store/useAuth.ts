import { create } from "zustand";
import { loginUser, User } from "./types.ts";
import axios from "axios";
import toast from "react-hot-toast";

interface AuthState {
  user: User | null;
  isSigningUp: boolean;
  isLogging: boolean;
  signup: (data: User) => void;
  login: (data: loginUser) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isSigningUp: false,
  isLogging: false,
  signup: async (data: User) => {
    set({ isSigningUp: true });
    try {
      const res = await axios.post("http://localhost:9294/api/user/signup", data,{
        withCredentials: true
      });
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
      const res = await axios.post("http://localhost:9294/api/user/login", data,{
        withCredentials: true
      });
      set({ user: res.data });
      toast.success("Logged In");
    } catch (error: any) {
      toast.error(error.response?.data?.msg || "An error occurred");
    } finally {
      set({ isLogging: false });
    }
  },
  logout: async () =>{
    try {
      const res = await axios.post("http://localhost:9294/api/user/logout", {},{
        withCredentials: true
      });
      toast.success("Logged Out");
    } catch (error: any) {
      toast.error(error.response?.data?.msg || "An error occurred");
    }
  }
}));
