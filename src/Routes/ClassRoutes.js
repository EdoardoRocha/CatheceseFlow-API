import { Router } from "express";
const router = Router();

//Controllers
import ClassController from "../Controllers/ClassController.js";

//Middlewares
import checkToken from "../Middlewares/authToken.js";
import checkRole from "../Middlewares/authRole.js";
import validateClass from "../Middlewares/validateClass.js";

//Routes
router.post("/create", checkToken, validateClass, checkRole(['Coordenador', 'Admin', 'Catequista']), ClassController.createClass);
router.get("/my-parish", checkToken, checkRole(['Coordenador', 'Admin', 'Catequista']), ClassController.getAllClassesByParish);

export default router;
