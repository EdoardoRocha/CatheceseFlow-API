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
}
