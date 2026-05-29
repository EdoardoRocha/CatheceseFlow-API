import User from "../Models/Users.js";
import bcrypt from "bcryptjs";
import { createUserToken } from "../Helpers/create-user-token.js";

export default class UserController {
  static async register(req, res) {
    const { name, email, password, role, ParishId } = req.body;

    try {
      //Create password
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);
      const newUser = await User.create({
        name,
        email,
        password: passwordHash,
        role,
        ParishId,
      });
      const createdUser = createUserToken(newUser);

      res.status(201).json({
        message: "Usuário criado com sucesso!",
        token: createdUser,
        userId: newUser.id,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }

  static async login(req, res) {
    const email = req.body.email;

    try {
      const user = await User.findOne({
        where: { email },
        attributes: { exclude: ["password"] },
      });

      const createdUser = createUserToken(user);

      res.status(200).json({
        message: "Você está logado",
        token: createdUser,
        user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }

  static async getUsersByParisheId(req, res) {
    const { parishId } = req.params;

    try {
      const users = await User.findAll({
        where: { ParishId: parishId },
      });

      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
}
