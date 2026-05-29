import { DataTypes } from "sequelize";
import conn from "../Config/db.js";

const Student = conn.define('Students', {
    cpf: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    has_baptism: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    has_first_communion: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});



export default Student;