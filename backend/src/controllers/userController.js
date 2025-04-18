import dotenv from "dotenv";
dotenv.config(); 


import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error(" JWT_SECRET is missing from environment variables");
  process.exit(1);
}

export const registerController = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(201).json({
      message: "User created",
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
