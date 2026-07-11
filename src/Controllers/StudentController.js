import Student from "../Models/Students.js";
import StudentPhone from "../Models/StudentPhones.js";
import Address from "../Models/Address.js";
import Class from "../Models/Class.js";

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

function extractAddressFields(plain) {
  const address = plain.Address ?? plain.address ?? {};
  return {
    road: trimOrNull(plain.road ?? address.road),
    house_number:
      plain.house_number != null && String(plain.house_number).trim() !== ""
        ? Number(plain.house_number)
        : address.house_number != null
          ? Number(address.house_number)
          : null,
    code: trimOrNull(plain.code ?? address.code),
    city: trimOrNull(plain.city ?? address.city),
    neighborhood: trimOrNull(plain.neighborhood ?? address.neighborhood),
  };
}

function mapStudentResponse(student) {
  const plain = student.toJSON ? student.toJSON() : student;
  const phones = resolveStudentPhones(plain);
  const addressFields = extractAddressFields(plain);

  return {
    ...plain,
    ...addressFields,
    phones,
    phone: phones[0]?.number ?? null,
    phoneSummary: formatPhoneSummary(phones),
    address: addressFields,
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

async function resolveAddressId({ road, house_number, code, city, neighborhood }) {
  if (
    !hasCompleteAddress({
      road,
      house_number,
      code,
      city,
      neighborhood,
    })
  ) {
    return null;
  }

  const addressData = {
    road: trimOrNull(road),
    code: trimOrNull(code),
    house_number: Number(house_number),
    city: trimOrNull(city),
    neighborhood: trimOrNull(neighborhood),
  };

  const addressExist = await Address.findOne({ where: addressData });
  if (!addressExist) {
    const address = await Address.create(addressData);
    return address.id;
  }

  return addressExist.id;
}

async function syncStudentPhones(studentId, normalizedPhones) {
  await StudentPhone.destroy({ where: { StudentId: studentId } });

  if (normalizedPhones.length > 0) {
    await StudentPhone.bulkCreate(
      normalizedPhones.map((entry) => ({
        number: entry.number,
        label: entry.label,
        StudentId: studentId,
      })),
    );
  }
}

async function findStudentWithDetails(studentId) {
  return Student.findByPk(studentId, {
    include: [
      { model: StudentPhone, as: "phones" },
      { model: Address },
      { model: Class, attributes: ["id", "ParishId"] },
    ],
  });
}

async function assertStudentParishAccess(studentId, parishId, res) {
  const student = await Student.findByPk(studentId, {
    include: [{ model: Class, attributes: ["id", "ParishId"] }],
  });

  if (!student) {
    res.status(404).json({ message: "Estudante não encontrado." });
    return null;
  }

  if (student.Class.ParishId !== parishId) {
    res.status(403).json({
      message: "Você não tem permissão para acessar este estudante.",
    });
    return null;
  }

  return student;
}

function buildStudentPayload(body, classId, addressId) {
  const {
    name,
    cpf,
    has_baptism,
    has_first_communion,
    birth_date,
    father_name,
    mother_name,
    description,
  } = body;

  return {
    name: String(name).trim(),
    phone: null,
    cpf: trimOrNull(cpf),
    birth_date: birth_date || null,
    father_name: trimOrNull(father_name),
    mother_name: trimOrNull(mother_name),
    description: trimOrNull(description),
    ClassId: classId,
    AddressId: addressId,
    has_baptism: has_baptism ?? false,
    has_first_communion: has_first_communion ?? false,
  };
}

export default class StudentController {
  static async createStudent(req, res) {
    const {
      road,
      house_number,
      code,
      city,
      neighborhood,
      classId,
    } = req.body;

    try {
      const correctAddressId = await resolveAddressId({
        road,
        house_number,
        code,
        city,
        neighborhood,
      });

      const normalizedPhones = normalizePhones(req.body);
      const studentData = buildStudentPayload(
        req.body,
        classId,
        correctAddressId,
      );

      const student = await Student.create(studentData);
      await syncStudentPhones(student.id, normalizedPhones);

      const created = await findStudentWithDetails(student.id);

      res.status(201).json({
        message: "Estudante adicionado com sucesso!",
        student: mapStudentResponse(created),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }

  static async getStudentById(req, res) {
    const { studentId } = req.params;

    try {
      const allowed = await assertStudentParishAccess(
        studentId,
        req.user.ParishId,
        res,
      );
      if (!allowed) return;

      const student = await findStudentWithDetails(studentId);
      res.status(200).json(mapStudentResponse(student));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }

  static async updateStudent(req, res) {
    const { studentId } = req.params;
    const student = req.student;
    const { road, house_number, code, city, neighborhood } = req.body;

    try {
      const correctAddressId = await resolveAddressId({
        road,
        house_number,
        code,
        city,
        neighborhood,
      });

      const normalizedPhones = normalizePhones(req.body);
      const studentData = buildStudentPayload(
        req.body,
        student.ClassId,
        correctAddressId,
      );

      await student.update(studentData);
      await syncStudentPhones(student.id, normalizedPhones);

      const updated = await findStudentWithDetails(student.id);

      res.status(200).json({
        message: "Estudante atualizado com sucesso!",
        student: mapStudentResponse(updated),
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
