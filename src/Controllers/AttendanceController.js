import conn from "../Config/db.js";
import Attendance from "../Models/Attendances.js";

export default class AttendanceController {
  static async addAttendance(req, res) {
    const { lectureId } = req.body;
    const studentId = req.params.studentId;

    const t = await conn.transaction();
    try {
      const attendance = await Attendance.create(
        {
          StudentId: studentId,
          LectureId: lectureId,
        },
        { transaction: t },
      );

      await t.commit();
      res.status(201).json({ message: "Presença registrada com sucesso!" });
    } catch (error) {
      await t.rollback();
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }

  static async getAttendanceByLecture(req, res) {
    const { lectureId } = req.params;

    try {
      const attendances = await Attendance.findAll({
        where: { LectureId: lectureId },
      });
      res.status(200).json(attendances);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }

  static async removeAttendance(req, res) {
    const { studentId, lectureId } = req.params;

    try {
      const deleted = await Attendance.destroy({
        where: { StudentId: studentId, LectureId: lectureId },
      });
      if (deleted) {
        res.status(200).json({ message: "Presença removida com sucesso!" });
      } else {
        res
          .status(404)
          .json({ message: "Registro de presença não encontrado!" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
}
