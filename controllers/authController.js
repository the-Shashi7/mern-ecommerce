import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, question } = req.body;
    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!password) {
      return res.send({ message: "Password is required" });
    }
    if (!email) {
      return res.send({ message: "Email is required" });
    }
    if (!phone) {
      return res.send({ message: "Phone Number is required" });
    }
    if (!address) {
      return res.send({ message: "Address is required" });
    }
    if (!question) {
      return res.send({ message: "Question is required" });
    }
    //check existing users
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: true,
        message: "User already exist please login with this email",
        existingUser,
      });
    }
    //Create new user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      address,
      phone,
      question,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: "User reister successfully",
      user,
    });
  } catch (error) {
    return res.send({
      message: "Error in registerControllers",
      error: error,
    });
  }
};

//Post Login
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation;
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      res.status(401).send({
        success: false,
        message: "Password is incorrect",
      });
    } else {
      //token created;
      const token = await JWT.sign({ _id: user._id }, "HELLOWORLD", {
        expiresIn: "7d",
      });
      res.status(200).send({
        success: true,
        message: "login successfully",
        user: {
          _id: user._id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          address: user.address,
          question: user.question,
        },
        token: token,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

//forgot password
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, question, password } = req.body;

    if (!email) {
      return res.status(500).send({
        message: "Email is required",
        success: false,
      });
    }
    if (!question) {
      return res.status(500).send({
        message: "Answer is required",
        success: false,
      });
    }
    if (!password) {
      return res.status(500).send({
        message: "New Password is required",
        success: false,
      });
    }
    const user = await userModel.findOne({ email, question });
    if (!user) {
      return res.status(404).send({
        message: "User not found",
        success: false,
      });
    }
    const hashedPassword = await hashPassword(password);
    await userModel.findByIdAndUpdate(user._id, { password: hashedPassword });
    res.status(200).send({
      message: "Password Change Successfully",
      success: true,
    });
  } catch (error) {
    console.log("message :", error);
    res.status(400).send({
      message: "Something Went Wrong With Forgot Password Section",
    });
  }
};

//Test
export const test = async (req, res) => {
  try {
    res.send({
      success: true,
      message: "User is a Admin",
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error in test",
    });
  }
};
