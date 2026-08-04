import { DataTypes, Model } from "sequelize";

class Designation extends Model {
  static initialize(sequelize) {
    Designation.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
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
        name: {
          type: DataTypes.STRING(100),
          allowNull: false,
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
        modelName: "Designation",
        tableName: "designations",
        timestamps: true,
        underscored: true,
      },
    );
  }

  static associate(models) {
    Designation.belongsTo(models.Department, {
      foreignKey: "department_id",
      as: "department",
    });
    Designation.hasMany(models.Employee, {
      foreignKey: "designation_id",
      as: "employees",
    });
  }
}

export default Designation;
