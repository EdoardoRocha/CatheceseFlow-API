import { DataTypes } from "sequelize";
import conn from "../Config/db.js";

const Parishe = conn.define('Parishes', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    diocese: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    parishe_access_code: {
        type: DataTypes.STRING,
        allowNull: false
    }
});



export default Parishe;