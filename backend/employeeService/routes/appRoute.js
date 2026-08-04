import express from "express";
import { healthCheck , createEmployee , getAllLeaveTypes,getAllEmployees, getEmployeeProfile,getAllDesignations , getAllDepartments, createLeaveRequest, fetchMyLeaveRequests, getAllLeaves, changeLeaveStatus} from "../controllers/appController.js";

const appRoute = express.Router();

appRoute.get("/health", healthCheck);
appRoute.get("/leaves", getAllLeaveTypes);
appRoute.post("/createemployee", createEmployee);
appRoute.get("/employeedata", getEmployeeProfile);
appRoute.get("/departments", getAllDepartments);
appRoute.get("/designations", getAllDesignations);
appRoute.get("/employees", getAllEmployees);
appRoute.post("/applyleaverequest", createLeaveRequest);
appRoute.get("/myleaverequests", fetchMyLeaveRequests);
appRoute.get("/leaverequests", getAllLeaves);
appRoute.put("/changeleavestatus/:id", changeLeaveStatus);

export default appRoute;