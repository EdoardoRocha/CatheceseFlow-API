import { Router } from "express";
const router = Router();

//Import Controllers
import ParisheController from "../Controllers/ParisheController.js";

//Import Middlewares
import checkToken from "../Middlewares/authToken.js";
import checkRole from "../Middlewares/authRole.js";

router.get(
  "/",
  ParisheController.getAllParishes,
);

export default router;
