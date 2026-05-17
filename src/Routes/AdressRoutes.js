import { Router } from "express";
const router = Router();

//Controllers
import AddressController from "../Controllers/AddressController.js";

//Middlewares
import checkToken from "../Middlewares/authToken.js";
import checkRole from "../Middlewares/authRole.js";

router.get(
  "/:addressId",
  checkToken,
  checkRole(["Coordenador", "Admin", "Catequista"]),
  AddressController.getAddressById,
);

export default router;
