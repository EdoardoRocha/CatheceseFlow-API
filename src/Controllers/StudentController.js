import Student from "../Models/Students.js";
import Address from "../Models/Address.js";

function trimOrNull(value) {
  if (value == null) return null;
  const s = String(value).trim();
  return s === "" ? null : s;
}

function hasCompleteAddress({ road, house_number, code, city, neighborhood }) {
  return (
    trimOrNull(road) &&
    house_number != null &&
    String(house_number).trim() !== "" &&
    trimOrNull(code) &&
    trimOrNull(city) &&
    trimOrNull(neighborhood)
  );
}

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
      birth_date,
      father_name,
      mother_name,
    } = req.body;

    try {
      let correctAddressId = null;

      if (
        hasCompleteAddress({
          road,
          house_number,
          code,
          city,
          neighborhood,
        })
      ) {
        const addressData = {
          road: trimOrNull(road),
          code: trimOrNull(code),
          house_number: Number(house_number),
          city: trimOrNull(city),
          neighborhood: trimOrNull(neighborhood),
        };

        const addressExist = await Address.findOne({
          where: addressData,
        });

        if (!addressExist) {
          const address = await Address.create(addressData);
          correctAddressId = address.id;
        } else {
          correctAddressId = addressExist.id;
        }
      }

      const studentData = {
        name: String(name).trim(),
        phone: trimOrNull(phone),
        cpf: trimOrNull(cpf),
        birth_date: birth_date || null,
        father_name: trimOrNull(father_name),
        mother_name: trimOrNull(mother_name),
        ClassId: classId,
        AddressId: correctAddressId,
        has_baptism: has_baptism ?? false,
        has_first_communion: has_first_communion ?? false,
      };

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
      const students = await Student.findAll({
        where: { ClassId: classId },
      });

      const baptismPending = students.filter((s) => !s.has_baptism);
      const firstCommunionPending = students.filter(
        (s) => !s.has_first_communion,
      );

      res.status(200).json({
        baptismPending: {
          total: baptismPending.length,
          students: baptismPending.map((s) => ({
            id: s.id,
            name: s.name,
            phone: s.phone,
          })),
        },
        firstCommunionPending: {
          total: firstCommunionPending.length,
          students: firstCommunionPending.map((s) => ({
            id: s.id,
            name: s.name,
            phone: s.phone,
          })),
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
}
