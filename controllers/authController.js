import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
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
    //check existing users
    const existingUser = await userModel.findOne({email});
    if(existingUser){
        return res.status(200).send({
            success:true,
            message:'User already exist please login with this email',
            existingUser,
        })
    }
    //Create new user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({name,email,address,phone, password : hashedPassword }).save();

    res.status(201).send({
        success:true,
        message:'User reister successfully',
        user
    })

  } catch (error) {
    return res.send({
        message:'Error in registerControllers',
        error:error
    })
  }
};


//Post Login 
export const loginController = async(req,res)=>{
  try {
    const {email,password} = req.body;
    //validation;
    if(!email || !password ){
      return res.status(404).send({
        success:false,
        message:'Invalid Email or Password'
      })
    }

    const user =await userModel.findOne({email});
    if(!user){
      return res.status(404).send({
        success:false,
        message:'Email is not registered'
      })
    }
    const match  = await comparePassword( password , user.password);
    if(!match){
      res.status(401).send({
        success:false,
        message:'Password is incorrect'
      })
    }
    
    //token created;
    const token = await JWT.sign({_id:user._id},'HELLOWORLD',{
      expiresIn:'7d',
    });
    res.status(200).send({
      success:true,
      message:'login successfully',
      user:{
        name:user.name,
        email:user.email,
        address:user.address,
      },
      token:token,
    })

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success:false,
      message:"Error in login",
      error,
    })
  }
}

//Test
export const test = async(req,res)=>{
    try {
      res.send({
        success:true,
        message:'User is a Admin'
      })
    } catch (error) {
      console.log(error)
      res.status(400).send({
        success:false,
        error,
        message:'Error in test'
      })
    }
}