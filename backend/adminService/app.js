import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import appRoute from './routes/appRoute.js';
import "dotenv/config.js";


const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/admin/api/v1', appRoute);

export default app;