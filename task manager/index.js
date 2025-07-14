import express from "express";
import dotenv from "dotenv";
import { connect } from "mongoose";
import connectDb from "./database/connectDb.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";


const app = express();
dotenv.config();
connectDb();

app.use(express.json());
app.use(express.static("public"))

app.use("/auth", authRoutes)
app.use("/tasks", taskRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server running on ${PORT}`)
})