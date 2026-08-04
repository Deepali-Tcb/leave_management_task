import axios from "axios";

const healthCheck = (req, res) => {
  res.status(200).json({ message: "Admin Service is running" });
};
const addEmployee = async (req, res) => {
  try {
    const data = req.body;

    // 1. Create user in Auth Service
    const authResponse = await axios.post(
      `${process.env.AUTH_SERVICE_URL}/createuser`,
      {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    );

    const user = authResponse.data.user;

    // 2. Create employee in Employee Service
    const employeeResponse = await axios.post(
      `${process.env.EMPLOYEE_SERVICE_URL}/createemployee`,
      {
        user_id: user.id,
        employee_name: data.name,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        date_of_birth: data.date_of_birth,
        joining_date: data.joining_date,
        department_id: data.department_id,
        designation_id: data.designation_id,
      },
    );

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      user,
      employee: employeeResponse.data.employee,
    });
  } catch (error) {
    // Rollback user if employee creation failed
    if (user && user.id) {
      try {
        await axios.delete(`${process.env.AUTH_SERVICE_URL}/${user.id}`);
      } catch (rollbackError) {
        console.error("Rollback failed:", rollbackError.message);
      }
    }

    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const fetchEmployees = async (req, res) => {
  try {
    const response = await axios.get(`${process.env.EMPLOYEE_SERVICE_URL}/employees`);
    return res.status(200).json({
      success: true,
      employees: response.data.employees,
    });
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
const fetchLeaveRequests = async (req, res) => {
  try {
    const response = await axios.get(`${process.env.EMPLOYEE_SERVICE_URL}/leaverequests`);
    return res.status(200).json({
      success: true,
      leaveRequests: response.data.leaveRequests,
    });
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
const changeLeaveStatus = async (req, res) => {
  try {
    const leaveRequestId = req.params.id;
    const { status } = req.body;

    const response = await axios.put(
      `${process.env.EMPLOYEE_SERVICE_URL}/changeleavestatus/${leaveRequestId}`,
      { status }
    );

    return res.status(200).json({
      success: true,
      message: "Leave request status updated successfully",
      leaveRequest: response.data.leaveRequest,
    });
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { healthCheck, addEmployee, fetchEmployees , fetchLeaveRequests , changeLeaveStatus};
