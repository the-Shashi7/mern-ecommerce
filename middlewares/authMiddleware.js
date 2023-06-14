import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

//Protectd routes token base

export const requireSignIn = async (req, res, next) => {
  try {
    const decod = JWT.verify(
      req.headers.authorization.split(" ")[1], 
      "HELLOWORLD");
    req.user = decod;
    res.send({
      message:'Somenting went wrong in require sign'
    })
    next();
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in requireSignIn token verifying",
      error,
    });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "User is not a Admin",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      error,
      message: "Error in isAdmin",
    });
  }
};
