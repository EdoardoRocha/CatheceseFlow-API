import { DataTypes } from "sequelize";
import conn from "../Config/db.js";

const Student = conn.define("Students", {
  cpf: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birth_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  father_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  mother_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  has_baptism: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  has_first_communion: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

export default Student;
