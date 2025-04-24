import { Request, Response, RequestHandler } from "express";
import bcrypt from "bcryptjs";
import { User, IUser } from "../models/user.model";
import { isValidEmail, isValidPassword } from "../utils/validate";
import { generateToken } from "../utils/jwt";

export const signup: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  // Validate email format
  if (!isValidEmail(email)) {
    res.status(400).json({ message: "Invalid email format" });
    return;
  }

  // Validate password requirements
  if (!isValidPassword(password)) {
    res.status(400).json({ 
      message: "Password must be at least 8 characters long" 
    });
    return;
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "An error occurred while creating the user" });
  }
};

export const signin: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const token = generateToken(user._id.toString());
    res.status(200).json({ token });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "An error occurred while signing in" });
  }
};
