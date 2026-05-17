import Parishe from "../Models/Parishes.js";
import User from "../Models/Users.js";

const validateClass = async (req, res, next) => {
  const { type, location, day, start, end } = req.body;

  //Validators
  if (!type)
    return res.status(400).json({ message: "O Tipo de turma é obrigatório!" });
  if (!location)
    return res.status(400).json({ message: "O local da turma é obrigatório!" });
  if (!day)
    return res.status(400).json({ message: "O dia da turma é obrigatório!" });
  if (!start)
    return res
      .status(400)
      .json({ message: "A hora que inciará a turma é obrigatória!" });

  if (!end)
    return res
      .status(400)
      .json({ message: "A hora que encerrará a turma é obrigatória!" });

  //Validate date format

  //Check Type info

  //Check if users belgons to Parishe
  const userParishId = req.user.ParishId;
  const bodyParishId = req.body.ParishId;

  if (bodyParishId && Number(bodyParishId) !== Number(userParishId))
    return res.status(403).json({
      message: "Acesso negado. Você só pode criar turmas para a sua paróquia!",
    });

  next();
};

export default validateClass;
