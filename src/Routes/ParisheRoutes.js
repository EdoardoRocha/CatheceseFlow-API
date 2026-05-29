import { Router } from "express";
const router = Router();

//Import Controllers
import ParisheController from "../Controllers/ParisheController";

//Import Middlewares
import checkToken from "../Middlewares/authToken";
import checkRole from "../Middlewares/authRole";

router.get(
  "/",
  checkToken,
  checkRole(["Catequista", "Coordenador", "Admin"]),
  ParisheController.getAllParishes,
);

export default router;
