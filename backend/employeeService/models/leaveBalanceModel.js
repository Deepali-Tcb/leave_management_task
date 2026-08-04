import { DataTypes, Model } from "sequelize";

class LeaveBalance extends Model {
  static initialize(sequelize) {
    LeaveBalance.init(
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

        year: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },

        total_leaves: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },

        used_leaves: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },

        remaining_leaves: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: "LeaveBalance",
        tableName: "leave_balances",
        timestamps: true,
        underscored: true,
      },
    );
  }

  static associate(models) {
    LeaveBalance.belongsTo(models.Employee, {
      foreignKey: "employee_id",
      as: "employee",
    });

    LeaveBalance.belongsTo(models.LeaveType, {
      foreignKey: "leave_type_id",
      as: "leaveType",
    });
  }
}

export default LeaveBalance;