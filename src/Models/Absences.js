import { DataTypes } from "sequelize";
import conn from "../Config/db.js";

const Absence = conn.define('Absences', {
    reason: {
        type: DataTypes.STRING,
        allowNull: false
    }
});



export default Absence;
