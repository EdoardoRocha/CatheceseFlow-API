// src/Models/index.js
import User from "./Users.js";
import Lecture from "./Lectures.js";
import Parishe from "./Parishes.js";
import Student from "./Students.js";
import StudentPhone from "./StudentPhones.js";
import Address from "./Address.js";
import Attendance from "./Attendances.js";
import Absence from "./Absences.js";
import Class from "./Class.js";

Parishe.hasMany(User);
User.belongsTo(Parishe);

User.belongsToMany(Lecture, { through: "teacher_lectures" });
Lecture.belongsToMany(User, { through: "teacher_lectures" });

Lecture.belongsToMany(User, { through: "teacher_lectures" });
User.belongsToMany(Lecture, { through: "teacher_lectures" });

Student.belongsTo(Address);
Address.hasOne(Student);

Class.belongsTo(Parishe);
Parishe.hasMany(Class);

Attendance.belongsTo(Lecture);
Lecture.hasMany(Attendance);

Attendance.belongsTo(Student);
Student.hasMany(Attendance);

Absence.belongsTo(Lecture);
Lecture.hasMany(Absence);

Absence.belongsTo(Student);
Student.hasMany(Absence);

Student.belongsTo(Class);
Class.hasMany(Student);

Student.hasMany(StudentPhone, { as: "phones", foreignKey: "StudentId" });
StudentPhone.belongsTo(Student, { foreignKey: "StudentId" });

Lecture.belongsTo(Class);
Class.hasMany(Lecture);
