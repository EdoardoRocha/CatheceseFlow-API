import User from "../Models/Users.js";
import jwt from 'jsonwebtoken';

export const getUserByToken = async token => {
    const decoded = jwt.verify(token, process.env.AUTH_SECRET);
    const userId = decoded.id;
    const user = await User.findByPk(userId);

    return user;
};