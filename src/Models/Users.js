import { DataTypes } from "sequelize";
import conn from "../Config/db.js";

const User = conn.define('Users', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('Catequista', 'Admin', 'Coordenador'),
        allowNull: false
    }
});

export default User;