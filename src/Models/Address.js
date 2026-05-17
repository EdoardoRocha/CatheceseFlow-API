import { DataTypes } from "sequelize";
import conn from "../Config/db.js";

const Address = conn.define('Address', {
    road: {
        type: DataTypes.STRING
    },
    code: {
        type: DataTypes.STRING
    },
    house_number: {
        type: DataTypes.INTEGER
    },
    city: {
        type: DataTypes.STRING
    },
    neighborhood: {
        type: DataTypes.STRING
    }
});

export default Address;