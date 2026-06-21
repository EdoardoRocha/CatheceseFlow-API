import { Router } from "express";
const router = Router();

//Controllers
import StudentController from "../Controllers/StudentController.js";

//Middlewares
import checkToken from "../Middlewares/authToken.js";
import checkRole from "../Middlewares/authRole.js";
import {
  validateNewStudent,
  validateUpdateStudent,
} from "../Middlewares/validateStudent.js";

const studentRoles = checkRole(["Coordenador", "Admin", "Catequista"]);

//Routes
router.post(
  "/create",
  checkToken,
  studentRoles,
  validateNewStudent,
  StudentController.createStudent,
);

router.get(
  "/student/:studentId",
  checkToken,
  studentRoles,
  StudentController.getStudentById,
);

router.put(
  "/student/:studentId",
  checkToken,
  studentRoles,
  validateUpdateStudent,
  StudentController.updateStudent,
);

router.get(
  "/class/:classId/sacraments-report",
  checkToken,
  studentRoles,
  StudentController.getSacramentsReportByClass,
);

router.get(
  "/:classId",
  checkToken,
  studentRoles,
  StudentController.getStudentsByClassId,
);

export default router;
