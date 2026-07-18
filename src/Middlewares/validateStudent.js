import { Op } from "sequelize";
import Class from "../Models/Class.js";
import Student from "../Models/Students.js";
import User from "../Models/Users.js";

const MAX_PHONES = 5;
const MAX_PHONE_LENGTH = 20;
const ALLOWED_CATEQUISTA_ROLES = ["Catequista", "Coordenador"];

async function validateResponsibleCatequista(userId, parishId, res) {
  if (userId == null || userId === "") {
    res.status(400).json({
      message: "O catequista responsável é obrigatório.",
    });
    return false;
  }

  const id = Number(userId);
  if (!Number.isFinite(id)) {
    res.status(400).json({ message: "Catequista responsável inválido." });
    return false;
  }

  const catequista = await User.findByPk(id);
  if (!catequista) {
    res.status(422).json({ message: "Catequista responsável inexistente." });
    return false;
  }

  if (catequista.ParishId !== parishId) {
    res.status(403).json({
      message:
        "Você não tem permissão para associar um catequista de outra paróquia.",
    });
    return false;
  }

  if (!ALLOWED_CATEQUISTA_ROLES.includes(catequista.role)) {
    res.status(400).json({
      message:
        "O responsável deve ser um usuário com perfil Catequista ou Coordenador.",
    });
    return false;
  }

  return true;
}

function validateName(name, res) {
  if (!name || !String(name).trim()) {
    res.status(400).json({ message: "Nome do estudante é obrigatório." });
    return false;
  }
  return true;
}

function validateBirthDate(birth_date, res) {
  if (birth_date && !/^\d{4}-\d{2}-\d{2}$/.test(String(birth_date))) {
    res
      .status(400)
      .json({ message: "Data de nascimento inválida. Use o formato AAAA-MM-DD." });
    return false;
  }
  return true;
}

function validatePhones(phones, res) {
  if (phones == null) return true;

  if (!Array.isArray(phones)) {
    res.status(400).json({ message: "O campo phones deve ser um array." });
    return false;
  }

  const filledPhones = phones.filter((entry) => {
    const number = entry?.number ?? entry?.phone;
    return number != null && String(number).trim() !== "";
  });

  if (filledPhones.length > MAX_PHONES) {
    res.status(400).json({
      message: `É permitido cadastrar no máximo ${MAX_PHONES} telefones por aluno.`,
    });
    return false;
  }

  for (const entry of filledPhones) {
    const number = String(entry?.number ?? entry?.phone ?? "").trim();
    if (number.length > MAX_PHONE_LENGTH) {
      res.status(400).json({
        message: `Cada telefone deve ter no máximo ${MAX_PHONE_LENGTH} caracteres.`,
      });
      return false;
    }
  }

  return true;
}

async function loadStudentForParish(studentId, parishId, res) {
  const student = await Student.findByPk(studentId, {
    include: [{ model: Class, attributes: ["id", "ParishId"] }],
  });

  if (!student) {
    res.status(404).json({ message: "Estudante não encontrado." });
    return null;
  }

  if (student.Class.ParishId !== parishId) {
    res.status(403).json({
      message: "Você não tem permissão para alterar este estudante.",
    });
    return null;
  }

  return student;
}

const validateNewStudent = async (req, res, next) => {
  const { name, cpf, classId, birth_date, phones, userId } = req.body;

  if (!validateName(name, res)) return;
  if (!classId)
    return res.status(400).json({ message: "A turma é obrigatória." });
  if (!validateBirthDate(birth_date, res)) return;
  if (!validatePhones(phones, res)) return;

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

  if (!(await validateResponsibleCatequista(userId, parishId, res))) return;

  next();
};

const validateUpdateStudent = async (req, res, next) => {
  const { name, cpf, birth_date, phones, userId } = req.body;
  const { studentId } = req.params;

  if (!validateName(name, res)) return;
  if (!validateBirthDate(birth_date, res)) return;
  if (!validatePhones(phones, res)) return;

  const student = await loadStudentForParish(
    studentId,
    req.user.ParishId,
    res,
  );
  if (!student) return;

  const cpfTrimmed = cpf != null ? String(cpf).trim() : "";
  if (cpfTrimmed) {
    const studentExist = await Student.findOne({
      where: {
        cpf: cpfTrimmed,
        ClassId: student.ClassId,
        id: { [Op.ne]: student.id },
      },
    });
    if (studentExist)
      return res
        .status(409)
        .json({ message: "Esse estudante já existe nesta turma!" });
  }

  if (!(await validateResponsibleCatequista(userId, req.user.ParishId, res)))
    return;

  req.student = student;
  next();
};

export { validateNewStudent, validateUpdateStudent };
