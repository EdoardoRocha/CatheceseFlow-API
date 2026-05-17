import Lecture from "../Models/Lectures.js";
import Student from "../Models/Students.js";

const validateAbsence = async (req, res, next) => {
  const { reason, lectureId } = req.body;
  const studentId = req.params.studentId;

  //Validators
  if (!reason)
    return res
      .status(400)
      .json({ message: "O motivo da falta é obrigatório!" });
  if (!studentId)
    return res
      .status(400)
      .json({ message: "O estudante precisa ser especificado!" });
  if (!lectureId)
    return res
      .status(400)
      .json({ message: "A formação é obrigatória para registrar uma falta!" });

  //Check if student Exists
  const studentExist = await Student.findByPk(studentId);
  if (!studentExist)
    return res.status(422).json({ message: "Estudante inexistente!" });

  //Check if lecture exists
  const lectureExist = await Lecture.findByPk(lectureId);
  if (!lectureExist)
    return res.status(422).json({ message: "Formação inexistente!" });

  //Check if student belongs to lecture

  //Check if user is teachr of lecture

  next();
};

export { validateAbsence };
