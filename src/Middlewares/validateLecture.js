import Class from "../Models/Class.js";
import User from "../Models/Users.js";

const validateNewLecture = async (req, res, next) => {
  const { location, theme, hour, date, classId, userIds } = req.body;

  //Validators
  if (!location)
    return res
      .status(400)
      .json({ message: "A localização da aula é obrigatória!" });

  if (!userIds)
    return res
      .status(400)
      .json({ message: "O Responsável pela formação é obrigatório!" });

  if (!theme)
    return res
      .status(400)
      .json({ message: "O tema do encontro é obrigatório!" });

  if (!hour)
    return res
      .status(400)
      .json({ message: "A Hora do encontro é obrigatória!" });

  if (!date)
    return res
      .status(400)
      .json({ message: "O dia da formação é obrigatório!" });

  if (!classId)
    return res.status(400).json({ message: "A turma é obrigatória!" });

  //Check if class of student exists
  const classExist = await Class.findByPk(classId);
  if (!classExist)
    return res.status(422).json({ message: "Turma inexistente." });

  //Check if class belongs to parishe of user
  const parishId = req.user.ParishId;

  if (parishId !== classExist.ParishId)
    return res.status(403).json({
      message: "Você não tem permissão para criar um encontro nessa turma.",
    });
  next();
};

const validateGetLectures = async (req, res, next) => {
  const classId = req.params.classId;
  //Check if class of student exists
  const classExist = await Class.findByPk(classId);
  if (!classExist)
    return res.status(422).json({ message: "Turma inexistente." });

  //Check if class belongs to parishe of user
  const parishId = req.user.ParishId;

  if (parishId !== classExist.ParishId)
    return res.status(403).json({
      message: "Você não tem permissão para ver os encontros dessa turma.",
    });

  next();
};

export { validateNewLecture, validateGetLectures };
