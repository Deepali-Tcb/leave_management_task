import { DataTypes, Model } from "sequelize";

class LeaveRequest extends Model {
  static initialize(sequelize) {
    LeaveRequest.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },

        employee_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "employees",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        leave_type_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "leave_types",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "RESTRICT",
        },
        start_date: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },

        end_date: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },

        total_days: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },

        reason: {
          type: DataTypes.TEXT,
          allowNull: false,
        },

        status: {
          type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
          defaultValue: "Pending",
        },

        approved_by: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },

        approved_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "LeaveRequest",
        tableName: "leave_requests",
        timestamps: true,
        underscored: true,
      },
    );
  }

  static associate(models) {
    LeaveRequest.belongsTo(models.Employee, {
      foreignKey: "employee_id",
      as: "employee",
    });

    LeaveRequest.belongsTo(models.LeaveType, {
      foreignKey: "leave_type_id",
      as: "leaveType",
    });
  }
}

export default LeaveRequest;
