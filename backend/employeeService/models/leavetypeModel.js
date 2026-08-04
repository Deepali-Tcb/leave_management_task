import { DataTypes, Model } from "sequelize";

class LeaveType extends Model {
    static initialize(sequelize) {
        LeaveType.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },

                name: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                    unique: true,
                },

                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },

                max_days: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },

                is_paid: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: true,
                },

                status: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: true,
                },
            },
            {
                sequelize,
                modelName: "LeaveType",
                tableName: "leave_types",
                timestamps: true,
                underscored: true,
            }
        );
    }

    static associate(models) {

    LeaveType.hasMany(models.LeaveBalance,{
        foreignKey:"leave_type_id",
        as:"leaveBalances"
    });

    LeaveType.hasMany(models.LeaveRequest,{
        foreignKey:"leave_type_id",
        as:"leaveRequests"
    });

}
}

export default LeaveType;