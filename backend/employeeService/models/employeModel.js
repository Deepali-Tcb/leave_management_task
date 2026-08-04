import { DataTypes, Model } from "sequelize";

class Employee extends Model {
  static initialize(sequelize) {
    Employee.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },

        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          unique: true,
        },

        employee_code: {
          type: DataTypes.STRING(20),
          allowNull: false,
          unique: true,
        },

        employee_name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },

        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },

        phone: {
          type: DataTypes.STRING(15),
          allowNull: true,
        },

        gender: {
          type: DataTypes.ENUM("Male", "Female", "Other"),
          allowNull: false,
        },

        date_of_birth: {
          type: DataTypes.DATEONLY,
          allowNull: true,
        },

        joining_date: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },

        designation_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "designations",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "RESTRICT",
        },
        department_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "departments",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "RESTRICT",
        },

        status: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
      },
      {
        sequelize,
        modelName: "Employee",
        tableName: "employees",
        timestamps: true,
        underscored: true,
      },
    );
  }

  static associate(models) {
    Employee.belongsTo(models.Department, {
      foreignKey: "department_id",
      as: "department",
    });

    Employee.belongsTo(models.Designation, {
      foreignKey: "designation_id",
      as: "designation",
    });

    Employee.hasMany(models.LeaveBalance, {
      foreignKey: "employee_id",
      as: "leaveBalances",
    });

    Employee.hasMany(models.LeaveRequest, {
      foreignKey: "employee_id",
      as: "leaveRequests",
    });
  }
}

export default Employee;
