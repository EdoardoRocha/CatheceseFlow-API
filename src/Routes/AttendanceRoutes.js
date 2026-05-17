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
  checkRole(["Catequista"]),
  validateAttendance,
  AttendanceController.addAttendance,
);

export default router;
