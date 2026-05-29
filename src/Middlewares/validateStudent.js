import Class from "../Models/Class.js";
import Parishe from "../Models/Parishes.js";
import Student from "../Models/Students.js";

const validateNewStudent = async (req, res, next) => {
  const {
    name,
    phone,
    cpf,
    road,
    house_number,
    code,
    city,
    neighborhood,
    classId,
    has_baptism,
    has_first_communion
  } = req.body;

  //validators
  if (!name)
    return res
      .status(400)
      .json({ message: "Nome do estudante é obrigatório." });

  if (!phone)
    return res
      .status(400)
      .json({ message: "Telefone do estudante ou responsável é obrigatório." });

  if (!cpf)
    return res
      .status(400)
      .json({ message: "O CPF do estudante é obrigatório." });

  if (!classId)
    return res.status(400).json({ message: "A turma é obrigatória." });

  if (!road || !house_number || !code || !city || !neighborhood)
    return res.status(400).json({ message: "Envie o endereço completo!" });

  //validators of types

  //Check if exist student
  const studentExist = await Student.findOne({
    where: {
      cpf,
      ClassId: classId,
    },
  });
  if (studentExist)
    return res
      .status(409)
      .json({ message: "Esse estudante já existe nesta turma!" });

  //Check if class of student exists
  const classExist = await Class.findByPk(classId);
  if (!classExist)
    return res.status(422).json({ message: "Turma inexistente." });

  //Check if class belongs to parishe of user
  const parishId = req.user.ParishId;

  if (parishId !== classExist.ParishId)
    return res.status(403).json({
      message:
        "Você não tem permissão para adicionar um estudante a essa turma.",
    });

  //Validator if student exists by name

  next();
};

export { validateNewStudent };
