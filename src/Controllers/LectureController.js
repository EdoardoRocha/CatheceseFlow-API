import Lecture from "../Models/Lectures.js";
import User from "../Models/Users.js";
import conn from "../Config/db.js";

export default class LectureController {
  static async createLecture(req, res) {
    const { location, theme, hour, date, classId, userIds } = req.body;

    const t = await conn.transaction();

    try {
      const lecture = await Lecture.create(
        {
          location,
          theme,
          hour,
          date,
          ClassId: classId,
        },
        { transaction: t },
      );

      if (userIds && userIds.length > 0) {
        await lecture.setUsers(userIds, { transaction: t });
      }

      await t.commit();
      res.status(201).json(lecture);
    } catch (error) {
      await t.rollback();
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }

  static async getLecturesByClassId(req, res) {
    const id = req.params.classId;

    try {
      const lectures = await Lecture.findAll({
        where: { ClassId: id },
        include: [
          {
            model: User,
            attributes: ["id", "name", "role"],
            through: { attributes: [] },
          },
        ],
      });

      res.status(200).json(lectures);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
}
