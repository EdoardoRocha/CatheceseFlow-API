import { DataTypes } from "sequelize";
import conn from "../Config/db.js";

const StudentPhone = conn.define("StudentPhones", {
  number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  label: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default StudentPhone;
