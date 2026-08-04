import express from "express";
import { addEmployee, changeLeaveStatus, fetchEmployees, fetchLeaveRequests, healthCheck } from "../controllers/appController.js";


const appRoute = express.Router();

appRoute.get("/health", healthCheck);
appRoute.post("/addemployee", addEmployee);
appRoute.get("/employees", fetchEmployees);
appRoute.get("/leaverequests", fetchLeaveRequests);
appRoute.put("/changeleavestatus/:id", changeLeaveStatus);


export default appRoute;
