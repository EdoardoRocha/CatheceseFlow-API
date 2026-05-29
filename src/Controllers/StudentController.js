import Student from "../Models/Students.js";
import Address from "../Models/Address.js";

export default class StudentController {
  static async createStudent(req, res) {
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
      has_first_communion,
    } = req.body;

    const addressData = {
      road,
      code,
      house_number,
      city,
      neighborhood,
    };

    try {
      //Check if address exist
      const addressExist = await Address.findOne({
        where: { road, code, house_number, city, neighborhood },
      });

      let correctAddressId;
      if (!addressExist) {
        //Save first Address
        const address = await Address.create(addressData);

        correctAddressId = address.id;
      } else {
        correctAddressId = addressExist.id;
      }
      const studentData = {
        name,
        phone,
        cpf,
        ClassId: classId,
        AddressId: correctAddressId,
        has_baptism: has_baptism ?? false,
        has_first_communion: has_first_communion ?? false,
      };

      //Now save student in class
      const student = await Student.create(studentData);

      res.status(201).json({
        message: "Estudante adicionado com sucesso!",
        student: student,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }

  static async getStudentsByClassId(req, res) {
    const id = req.params.classId;

    try {
      const students = await Student.findAll({ where: { ClassId: id } });

      res.status(200).json(students);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }

  static async getSacramentsReportByClass(req, res) {
    const { classId } = req.params;

    try {
      // Busca alunos sem Batismo (Trará o total e a lista de quem são)
      const missingBaptism = await Student.findAndCountAll({
        where: {
          ClassId: classId,
          has_baptism: false,
        },
        attributes: ["id", "name", "phone"],
      });

      const missingCommunion = await Student.findAndCountAll({
        where: {
          ClassId: classId,
          has_first_communion: false,
        },
        attributes: ["id", "name", "phone"],
      });

      res.status(200).json({
        baptismPending: {
          total: missingBaptism.count,
          students: missingBaptism.rows,
        },
        firstCommunionPending: {
          total: missingCommunion.count,
          students: missingCommunion.rows,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
}
