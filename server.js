import express from "express";
import  color  from "colors";
import dotenv from 'dotenv';
import connectDB from "./config/db.js";
import morgan from "morgan";
import authRoute from './routes/authRoute.js';
import { isAdmin, requireSignIn } from "./middlewares/authMiddleware.js";
import { test } from "./controllers/authController.js";
import cors from 'cors';

//configure .env
dotenv.config();
//PORT
const PORT = process.env.PORT || 8080;
//connect with db
connectDB();

//rest object
const app = express();
//Middlewares
app.use(cors());
app.use(express.json()); //parses incoming requests with JSON payloads
app.use(morgan('dev'));

//router call
app.use('/api/v1/auth', authRoute);

//rest api
app.get('/',(req,res)=>{
    res.send({
        message:"Welcome to e-commerce app"
        //"<h1>Hello from server</h1>"
    });
});


//Running server on port 8080;
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`.bgCyan.white);
});