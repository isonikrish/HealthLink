import { loginSchema, signupSchema } from "../lib/zodSchemas.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import {generateTokenAndSetCookie} from '../lib/generateToken.js'
export async function handleSignup(req, res) {
  try {
    const data = req.body;
    const validatedData = signupSchema.safeParse(data);
    if (!validatedData.success) {
      return res.status(400).json({
        msg: "Invalid credentials",
        errors: validatedData.error.errors,
      });
    }
    const { fullName, email, password, role, profilePic, gender, address } =
      validatedData.data;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role,
      profilePic,
      gender,
      address,
    });
    await newUser.save();

    if (!newUser)
      return res.status(400).json({ msg: "Error creating new user" });

    res.status(200).json({ msg: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error" });
  }
}
export async function handleLogin(req,res){
  try {
    const data = req.body;
    const validatedData = loginSchema.safeParse(data);
    if (!validatedData.success) {
      return res.status(400).json({
        msg: "Invalid credentials",
        errors: validatedData.error.errors,
      });
    }
    const { email, password} = validatedData.data;
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({msg: "No user found"})
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if(!isPasswordCorrect) return res.status(400).json({msg: "Invalid Password"})
    await generateTokenAndSetCookie(user._id, res);

    return res.status(200).json({msg: "Logged In Successfully"})

  } catch (error) {
    return res.status(500).json({msg: "Internal Server Error"})
  }
  
}
export async function handleLogout(req, res) {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      path: "/", 
    });
    res.status(200).json({ msg: "Logout Successfull" });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
}
