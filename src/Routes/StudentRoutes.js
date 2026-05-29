import { Router } from "express";
const router = Router();

//Controllers
import StudentController from "../Controllers/StudentController.js";

//Middlewares
import checkToken from "../Middlewares/authToken.js";
import checkRole from "../Middlewares/authRole.js";
import { validateNewStudent } from "../Middlewares/validateStudent.js";

//Routes
router.post(
  "/create",
  checkToken,
  checkRole(["Coordenador", "Admin", "Catequista"]),
  validateNewStudent,
  StudentController.createStudent,
);
router.get(
  "/:classId",
  checkToken,
  checkRole(["Coordenador", "Admin", "Catequista"]),
  StudentController.getStudentsByClassId,
);

router.get(
  "/class/:classId/sacraments-report",
  checkToken,
  checkRole(["Coordenador", "Admin", "Catequista"]),
  StudentController.getSacramentsReportByClass,
);

export default router;
