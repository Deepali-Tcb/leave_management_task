import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import "dotenv/config.js";
import authProxyRouter from './proxy/authProxy.js';
import employeeProxyRouter from './proxy/employeeProxy.js';
import adminProxyRouter from './proxy/adminProxy.js';


const app = express();

const port  = process.env.PORT || 8000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/" , (req , res)=>{
    res.send("Welcome to the API Gateway");
})
app.use("/api/v1/auth", authProxyRouter);
app.use("/api/v1/admin", adminProxyRouter);
app.use("/api/v1/employee", employeeProxyRouter);


app.listen(port, () => {
  console.log(`API Gateway is running on port ${port}`);
});

export default app;