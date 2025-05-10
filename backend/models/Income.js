import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "./User.js";

const Income = sequelize.define(
  "Incomes",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User, //references the usermodel
        key: "id",
      },
      onDelete: "CASCADE", //if user deleted, delete related incomes
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "incomes",
    timestamps: true,
  }
);

// Defining Association (One-to-Many: User can has many Income)
User.hasMany(Income, { foreignKey: "userId", onDelete: "CASCADE" });
Income.belongsTo(User, { foreignKey: "userId" });

export default Income;
