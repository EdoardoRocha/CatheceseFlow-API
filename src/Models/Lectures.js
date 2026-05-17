import { DataTypes } from "sequelize";
import conn from "../Config/db.js";

const Lecture = conn.define("Lectures", {
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  theme: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hour: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
});





export default Lecture;
