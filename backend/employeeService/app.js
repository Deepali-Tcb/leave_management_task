import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import appRoute from './routes/appRoute.js';
import "dotenv/config.js";
import { connectDB } from './config/db.js';
import "./models/index.js";

const app = express();

// db connection
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/employee/api/v1', appRoute);

export default app;