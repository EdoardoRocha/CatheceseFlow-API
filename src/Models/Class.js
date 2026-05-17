import { DataTypes } from "sequelize";
import conn from "../Config/db.js";

const Class = conn.define('Class', {
    type: {
        type: DataTypes.ENUM('Primeira Comunhão', 'Perseverança', 'Crisma'),
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    day: {
        type: DataTypes.ENUM('Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado'),
        allowNull: false
    },
    start: {
        type: DataTypes.TIME,
        allowNull: false
    },
    end: {
        type: DataTypes.TIME,
        allowNull: false
    }
});



export default Class;