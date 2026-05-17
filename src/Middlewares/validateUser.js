//Models
import User from "../Models/Users.js";
import Parishe from "../Models/Parishes.js";

//Dependencies
import bcrypt from "bcryptjs";

const validateNewUser = async (req, res, next) => {
  const { name, email, password, confirmPassword, role, ParishId } = req.body;

  //Validators
  if (!name) return res.status(400).json({ message: "O nome é obrigatório!" });
  if (!email)
    return res.status(400).json({ message: "O e-mail é obrigatório!" });
  if (!password)
    return res.status(400).json({ message: "A senha é obrigatória!" });
  if (!confirmPassword)
    return res
      .status(400)
      .json({ message: "A confirmação de senha é obrigatória!" });
  if (!role)
    return res
      .status(400)
      .json({ message: "O Papel do usuário é obrigatório!" });
  if (!ParishId)
    return res.status(400).json({
      message: "É necessário ter uma paróquia associada a esse usuário!",
    });

  //Check length
  if (name.length >= 100 || email.length >= 100 || password.length >= 100)
    return res.status(400).json({ message: "Informações longas demais!" });

  //Chech if password is confirm password equals

  if (password !== confirmPassword)
    return res.status(400).json({ message: "Senhas diferentes!" });

  //Check if password type is string

  if (typeof password !== "string")
    return res.status(422).json({ message: "A senha precisa ser um texto!" });
  if (typeof ParishId !== "number")
    return res
      .status(422)
      .json({ message: "ID de paróquia inválido, envie um número!" });

  try {
    //Check if user exists

    const userExist = await User.findOne({
      where: { email },
      attributes: { exclude: ["password"] },
    });

    if (userExist) {
      return res.status(409).json({
        message: "Esse usuário já está cadastrado em nossa plataforma!",
      });
    }

    //Check if Parish existis

    const parisheExist = await Parishe.findOne({ where: { id: ParishId } });

    if (!parisheExist)
      return res
        .status(404)
        .json({ message: "Paróquia inexistente! Crie uma se necessário." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }

  next();
};

const validateUser = async (req, res, next) => {
  const { email, password } = req.body;

  //Validators
  if (!email)
    return res
      .status(400)
      .json({ message: "O Email é obrigatório para login" });
  if (!password)
    return res
      .status(400)
      .json({ message: "A senha é obrigatória para login!" });

  //Validate password type

  if (typeof password !== "string")
    return res.status(422).json({ message: "Tipo de senha inválida!" });

  try {
    //Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "Usuário inexistente!" });

    //Check if password match
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword)
      return res.status(422).json({ message: "Usuário ou senha inválidos!" });

    delete req.body.password;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }

  next();
};

export { validateNewUser, validateUser };
