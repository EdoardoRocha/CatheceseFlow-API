import { Router } from "express";
const router = Router();

//Controller
import UserController from "../Controllers/UserController.js";

//Middlewares
import { validateNewUser, validateUser } from "../Middlewares/validateUser.js";

//Routes
router.post("/register", validateNewUser, UserController.register);
router.post("/login", validateUser, UserController.login);
router.get("/:parishId", validateUser, UserController.getUsersByParisheId);

export default router;
