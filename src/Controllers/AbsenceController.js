import conn from "../Config/db.js";
import Absence from "../Models/Absences.js";

export default class AbsenceController {
  static async addAbsence(req, res) {
    const { reason, lectureId } = req.body;
    const studentId = req.params.studentId;

    const t = await conn.transaction();

    try {
      const absence = await Absence.create(
        {
          reason,
          StudentId: studentId,
          LectureId: lectureId,
        },
        {
          transaction: t,
        },
      );

      await t.commit();
      res.status(201).json({
        message: "A falta foi registrada com sucesso!",
      });
    } catch (error) {
      await t.rollback();
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }

  static async getAbsencesByLecture(req, res) {
    const { lectureId } = req.params;

    try {
      const absences = await Absence.findAll({
        where: { LectureId: lectureId },
      });

      res.status(200).json(absences);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }

  static async removeAbsence(req, res) {
    const { studentId, lectureId } = req.params;

    try {
      const deleted = await Absence.destroy({
        where: { StudentId: studentId, LectureId: lectureId },
      });

      if (deleted) {
        res.status(200).json({ message: "Falta removida com sucesso!" });
      } else {
        res.status(404).json({ message: "Registro de falta não encontrado." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
}
