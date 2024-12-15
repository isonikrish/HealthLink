import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/DbConnect.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from './routes/auth.js'
import appointmentRoutes from './routes/appointment.js'
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());


app.use("/api/user", authRoutes);
app.use("/api/appointment", appointmentRoutes)
connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server Started at ${process.env.PORT}`);
  });
});
