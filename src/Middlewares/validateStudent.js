import Class from "../Models/Class.js";
import Student from "../Models/Students.js";

const validateNewStudent = async (req, res, next) => {
  const { name, cpf, classId, birth_date } = req.body;

  if (!name || !String(name).trim())
    return res
      .status(400)
      .json({ message: "Nome do estudante é obrigatório." });

  if (!classId)
    return res.status(400).json({ message: "A turma é obrigatória." });

  if (birth_date && !/^\d{4}-\d{2}-\d{2}$/.test(String(birth_date)))
    return res
      .status(400)
      .json({ message: "Data de nascimento inválida. Use o formato AAAA-MM-DD." });

  const cpfTrimmed = cpf != null ? String(cpf).trim() : "";
  if (cpfTrimmed) {
    const studentExist = await Student.findOne({
      where: {
        cpf: cpfTrimmed,
        ClassId: classId,
      },
    });
    if (studentExist)
      return res
        .status(409)
        .json({ message: "Esse estudante já existe nesta turma!" });
  }

  const classExist = await Class.findByPk(classId);
  if (!classExist)
    return res.status(422).json({ message: "Turma inexistente." });

  const parishId = req.user.ParishId;

  if (parishId !== classExist.ParishId)
    return res.status(403).json({
      message:
        "Você não tem permissão para adicionar um estudante a essa turma.",
    });

  next();
};

export { validateNewStudent };
