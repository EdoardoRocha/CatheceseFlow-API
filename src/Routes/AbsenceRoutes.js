import { Router } from "express";
const router = Router();

//Controllers
import AbsenceController from "../Controllers/AbsenceController.js";

//Middlewares
import checkToken from "../Middlewares/authToken.js";
import checkRole from "../Middlewares/authRole.js";
import { validateAbsence } from "../Middlewares/validateAbsence.js";

router.post(
  "/:studentId",
  checkToken,
  checkRole(["Catequista"]),
  validateAbsence,
  AbsenceController.addAbsence,
);

router.get(
  "/lecture/:lectureId",
  checkToken,
  checkRole(["Catequista", "Coordenador", "Admin"]),
  AbsenceController.getAbsencesByLecture,
);

router.delete(
  "/:studentId/:lectureId",
  checkToken,
  checkRole(["Catequista", "Coordenador", "Admin"]),
  AbsenceController.removeAbsence,
);

export default router;
