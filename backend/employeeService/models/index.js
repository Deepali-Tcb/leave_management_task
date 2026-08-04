import { sequelize } from "../config/db.js";

import Employee from "./employeModel.js";
import LeaveRequest from "./leaveRequestModel.js";
import LeaveBalance from "./leaveBalanceModel.js";
import Department from "./departmentModel.js";
import Designation from "./designationModel.js";
import LeaveType from "./leavetypeModel.js";

// Initialize Models
Employee.initialize(sequelize);
LeaveRequest.initialize(sequelize);
LeaveBalance.initialize(sequelize);
Department.initialize(sequelize);
Designation.initialize(sequelize);
LeaveType.initialize(sequelize);

// Create models object
const models = {
    Employee,
    LeaveRequest,
    LeaveBalance,
    Department,
    Designation,
    LeaveType,
};

// Setup Associations
Object.values(models).forEach((model) => {
    if (model.associate) {
        model.associate(models);
    }
});

export default models;