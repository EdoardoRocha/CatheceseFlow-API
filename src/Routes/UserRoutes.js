import { Router } from "express";
const router = Router();

//Controller
import UserController from "../Controllers/UserController.js";

//Middlewares
import { validateNewUser, validateUser } from "../Middlewares/validateUser.js";
import checkToken from "../Middlewares/authToken.js";

//Routes
router.post("/register", validateNewUser, UserController.register);
router.post("/login", validateUser, UserController.login);
router.get("/:parishId", checkToken, UserController.getUsersByParisheId);

export default router;
