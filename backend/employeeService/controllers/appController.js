import { Op } from "sequelize";
import Employee from "../models/employeModel.js";
import LeaveType from "../models/leavetypeModel.js";
import LeaveBalance from "../models/leaveBalanceModel.js";
import Department from "../models/departmentModel.js";
import Designation from "../models/designationModel.js";
import LeaveRequest from "../models/leaveRequestModel.js";

const healthCheck = (req, res) => {
  res.status(200).json({ message: "Employee Service is running" });
};
const createEmployee = async (req, res) => {
  try {
    const {
      user_id,
      employee_name,
      email,
      phone,
      gender,
      date_of_birth,
      joining_date,
      department_id,
      designation_id,
    } = req.body;

    // Check if employee already exists
    const existingEmployee = await Employee.findOne({
      where: {
        [Op.or]: [{ user_id }, { email }],
      },
    });
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: "Employee already exists",
      });
    }
    // Last employee nikalo
    const lastEmployee = await Employee.findOne({
      order: [["id", "DESC"]],
    });

    // Code generate karo
    let employeeCode = "EMP0001";

    if (lastEmployee) {
      const nextNumber = lastEmployee.id + 1;
      employeeCode = `EMP${String(nextNumber).padStart(4, "0")}`;
    }
    // Create Employee
    const employee = await Employee.create({
      user_id,
      employee_code: employeeCode,
      employee_name,
      email,
      phone,
      gender,
      date_of_birth,
      joining_date,
      department_id,
      designation_id,
      status: true,
    });

    // Get all active leave types
    const leaveTypes = await LeaveType.findAll({
      where: {
        status: true,
      },
    });

    // Current Year
    const currentYear = new Date().getFullYear();

    // Prepare leave balance records
    const leaveBalances = leaveTypes.map((leaveType) => ({
      employee_id: employee.id,
      leave_type_id: leaveType.id,
      year: currentYear,
      total_leaves: leaveType.max_days,
      used_leaves: 0,
      remaining_leaves: leaveType.max_days,
    }));

    // Insert all leave balances
    await LeaveBalance.bulkCreate(leaveBalances);

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employee,
    });
  } catch (error) {
    console.error("Create Employee Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const getAllLeaveTypes = async (req, res) => {
  try {
    const leaveTypes = await LeaveType.findAll();
    return res.status(200).json({
      success: true,
      message: "Leave types fetched successfully",
      leaveTypes,
    });
  } catch (error) {
    console.error("Get All Leave Types Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll();
    return res.status(200).json({
      success: true,
      message: "Departments fetched successfully",
      departments,
    });
  } catch (error) {
    console.error("Get All Departments Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const getAllDesignations = async (req, res) => {
  try {
    const designations = await Designation.findAll();
    return res.status(200).json({
      success: true,
      message: "Designations fetched successfully",
      designations,
    });
  } catch (error) {
    console.error("Get All Designations fetch Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll();
    return res.status(200).json({
      success: true,
      message: "Employees fetched successfully",
      employees,
    });
  } catch (error) {
    console.error("Get All employees fetch Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const getEmployeeProfile = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    const employee = await Employee.findOne({
      where: {
        user_id: userId,
      },
      include: [
        {
          model: Department,
          as: "department",
          attributes: ["id", "name"],
        },
        {
          model: Designation,
          as: "designation",
          attributes: ["id", "name"],
        },
        {
          model: LeaveBalance,
          as: "leaveBalances",
          attributes: [
            "id",
            "year",
            "total_leaves",
            "used_leaves",
            "remaining_leaves",
          ],
          include: [
            {
              model: LeaveType,
              as: "leaveType",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      employee,
    });
  } catch (error) {
    console.error("Get Employee Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const createLeaveRequest = async (req, res) => {
  try {
    const { leave_type_id, start_date, end_date, reason } = req.body;

    const userId = req.headers["x-user-id"];

    // Validation
    if (!leave_type_id || !start_date || !end_date || !reason) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Find employee using user_id from JWT
    const employee = await Employee.findOne({
      where: {
        user_id: userId,
      },
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Calculate total days
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    const diffTime = endDate - startDate;

    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (totalDays <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid date range",
      });
    }

    // Create Leave Request
    const leaveRequest = await LeaveRequest.create({
      employee_id: employee.id,
      leave_type_id,
      start_date,
      end_date,
      total_days: totalDays,
      reason,
      status: "Pending",
    });

    return res.status(201).json({
      success: true,
      message: "Leave request created successfully",
      leaveRequest,
    });
  } catch (error) {
    console.error("Create Leave Request Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const fetchMyLeaveRequests = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    // Find employee using user_id from JWT
    const employee = await Employee.findOne({
      where: {
        user_id: userId,
      },
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Fetch leave requests for the employee
    const leaveRequests = await LeaveRequest.findAll({
      where: {
        employee_id: employee.id,
      },
      include: [
        {
          model: LeaveType,
          as: "leaveType",
          attributes: ["id", "name"],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Leave requests fetched successfully",
      leaveRequests,
    });
  } catch (error) {
    console.error("Fetch Leave Requests Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const getAllLeaves = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.findAll({
      include: [
        {
          model: LeaveType,
          as: "leaveType",
          attributes: ["id", "name"],
        },
      ],
    });
    return res.status(200).json({
      success: true,
      message: "Leave requests fetched successfully",
      leaveRequests,
    });
  } catch (error) {
    console.error("Get All leave requests fetch Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const changeLeaveStatus = async (req, res) => {
  try {

    const leaveRequestId = req.params.id;
    const { status } = req.body;


    const leaveRequest = await LeaveRequest.findByPk(
      leaveRequestId
    );


    if (!leaveRequest) {
      return res.status(404).json({
        success:false,
        message:"Leave request not found"
      });
    }


    // Only when approving
    if(status === "Approved") {


      const leaveBalance = await LeaveBalance.findOne({
        where:{
          employee_id: leaveRequest.employee_id,
          leave_type_id: leaveRequest.leave_type_id,
          year:new Date().getFullYear()
        }
      });


      if(!leaveBalance){
        return res.status(404).json({
          success:false,
          message:"Leave balance not found"
        });
      }


      if(leaveBalance.remaining_leaves < leaveRequest.total_days){

        return res.status(400).json({
          success:false,
          message:"Not enough leave balance"
        });

      }


      leaveBalance.used_leaves += leaveRequest.total_days;

      leaveBalance.remaining_leaves -= leaveRequest.total_days;

      await leaveBalance.save();


      leaveRequest.approved_by = req.headers["x-user-id"];
      leaveRequest.approved_at = new Date();

    }


    leaveRequest.status = status;

    await leaveRequest.save();


    return res.status(200).json({
      success:true,
      message:"Leave status updated",
      leaveRequest
    });


  } catch(error){

    return res.status(500).json({
      success:false,
      message:error.message
    });

  }
};
export {
  healthCheck,
  createEmployee,
  getAllLeaveTypes,
  getEmployeeProfile,
  fetchMyLeaveRequests,
  getAllDepartments,
  getAllDesignations,
  getAllEmployees,
  createLeaveRequest,
  getAllLeaves,
  changeLeaveStatus,
};
