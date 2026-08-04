import { DataTypes, Model } from "sequelize";


class Department extends Model {
    static initialize(sequelize) {
        Department.init(
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

                status: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: true,
                },
            },
            {
                sequelize,
                modelName: "Department",
                tableName: "departments",
                timestamps: true,
                underscored: true,
            }
        );
    }

    static associate(models) {
        Department.hasMany(models.Designation, {
            foreignKey: "department_id",
            as: "designations",
        });
        Department.hasMany(models.Employee,{
            foreignKey:"department_id",
            as:"employees"
        });
    }
}

export default Department;