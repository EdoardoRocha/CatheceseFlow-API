import Class from "../Models/Class.js";

export default class ClassController {
  static async createClass(req, res) {
    const { type, location, day, start, end } = req.body;
    const parishId = req.user.ParishId;

    try {
      const classCreated = await Class.create({
        type,
        location,
        day,
        start,
        end,
        ParishId: parishId,
      });

      res.status(201).json({
        message: "Turma criada com sucesso",
        classId: classCreated,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }

  static async getAllClassesByParish(req, res) {
    try {
      const parishId = req.user.ParishId;

      const classes = await Class.findAll({
        where: { ParishId: parishId },
        order: [
          ["day", "ASC"],
          ["start", "ASC"],
        ],
      }); 

      res.status(200).json(classes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
}
