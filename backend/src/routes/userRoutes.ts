import { Router } from "express";
import { UserController } from "../controllers/userController";

const router = Router();

const controller = new UserController();

router.post("/login", controller.login);

router.get("/:id", controller.getById);

router.post("/", controller.create);

router.put("/:id", controller.update);

router.delete("/:id", controller.delete);

export default router;
