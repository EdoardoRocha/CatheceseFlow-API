import { Router } from "express";
const router = Router();

//Controllers
import LectureController from "../Controllers/LectureController.js";

//Middlewares
import checkRole from "../Middlewares/authRole.js";
import checkToken from "../Middlewares/authToken.js";
import {
  validateNewLecture,
  validateGetLectures,
} from "../Middlewares/validateLecture.js";

router.post(
  "/create",
  checkToken,
  checkRole(["Coordenador", "Admin", "Catequista"]),
  validateNewLecture,
  LectureController.createLecture,
);
router.get(
  "/:classId",
  checkToken,
  checkRole(["Coordenador", "Admin", "Catequista"]),
  validateGetLectures,
  LectureController.getLecturesByClassId,
);

export default router;
