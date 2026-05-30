import { Router } from "express";
const router = Router();

//Controllers
import AttendanceController from "../Controllers/AttendanceController.js";

//Middlewares
import checkRole from "../Middlewares/authRole.js";
import checkToken from "../Middlewares/authToken.js";
import { validateAttendance } from "../Middlewares/validateAttendance.js";

router.post(
  "/:studentId",
  checkToken,
  validateAttendance,
  AttendanceController.addAttendance,
);
router.get(
  "/lecture/:lectureId",
  checkToken,
  checkRole(
    ["Catequista", "Coordenador", "Admin"],
  ),
  AttendanceController.getAttendanceByLecture,
);
router.delete(
  "/:studentId/:lectureId",
  checkToken,
  checkRole(["Catequista", "Coordenador", "Admin"]),
  AttendanceController.removeAttendance,
);

export default router;
