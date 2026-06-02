import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/database.js';
import userRoute from './routes/userRoute.js';
import messageRoute from './routes/messageRoute.js';
import { app, server } from './socket/socket.js';

dotenv.config({});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    connectDB();
    console.log(`Server listening at port ${PORT}`);
});