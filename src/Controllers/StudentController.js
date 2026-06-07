import Student from "../Models/Students.js";
import StudentPhone from "../Models/StudentPhones.js";
import Address from "../Models/Address.js";

function trimOrNull(value) {
  if (value == null) return null;
  const s = String(value).trim();
  return s === "" ? null : s;
}

function normalizePhones(body) {
  const { phones, phone } = body;

  if (Array.isArray(phones)) {
    return phones
      .map((entry) => ({
        number: trimOrNull(entry?.number ?? entry?.phone),
        label: trimOrNull(entry?.label),
      }))
      .filter((entry) => entry.number != null);
  }

  const legacyPhone = trimOrNull(phone);
  if (legacyPhone) {
    return [{ number: legacyPhone, label: null }];
  }

  return [];
}

function mapPhoneRecord(phone) {
  return {
    id: phone.id,
    number: phone.number,
    label: phone.label,
  };
}

function resolveStudentPhones(student) {
  const phones = (student.phones ?? []).map(mapPhoneRecord);
  if (phones.length > 0) return phones;

  const legacyPhone = trimOrNull(student.phone);
  if (legacyPhone) {
    return [{ number: legacyPhone, label: null }];
  }

  return [];
}

function formatPhoneSummary(phones) {
  if (!phones.length) return null;
  return phones
    .map((p) => (p.label ? `${p.label}: ${p.number}` : p.number))
    .join(" · ");
}

function mapStudentResponse(student) {
  const plain = student.toJSON ? student.toJSON() : student;
  const phones = resolveStudentPhones(plain);

  return {
    ...plain,
    phones,
    phone: phones[0]?.number ?? null,
    phoneSummary: formatPhoneSummary(phones),
  };
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

      const normalizedPhones = normalizePhones(req.body);

      const studentData = {
        name: String(name).trim(),
        phone: null,
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

      if (normalizedPhones.length > 0) {
        await StudentPhone.bulkCreate(
          normalizedPhones.map((entry) => ({
            number: entry.number,
            label: entry.label,
            StudentId: student.id,
          })),
        );
      }

      const created = await Student.findByPk(student.id, {
        include: [{ model: StudentPhone, as: "phones" }],
      });

      res.status(201).json({
        message: "Estudante adicionado com sucesso!",
        student: mapStudentResponse(created),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }

  static async getStudentsByClassId(req, res) {
    const id = req.params.classId;

    try {
      const students = await Student.findAll({
        where: { ClassId: id },
        include: [{ model: StudentPhone, as: "phones" }],
      });

      res.status(200).json(students.map(mapStudentResponse));
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
        include: [{ model: StudentPhone, as: "phones" }],
      });

      const baptismPending = students.filter((s) => !s.has_baptism);
      const firstCommunionPending = students.filter(
        (s) => !s.has_first_communion,
      );

      const mapSacramentStudent = (s) => {
        const mapped = mapStudentResponse(s);
        return {
          id: mapped.id,
          name: mapped.name,
          phones: mapped.phones,
          phone: mapped.phone,
          phoneSummary: mapped.phoneSummary,
        };
      };

      res.status(200).json({
        baptismPending: {
          total: baptismPending.length,
          students: baptismPending.map(mapSacramentStudent),
        },
        firstCommunionPending: {
          total: firstCommunionPending.length,
          students: firstCommunionPending.map(mapSacramentStudent),
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
}
