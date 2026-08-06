import { Router } from "express";
import { TaskController } from "../controllers/taskController";
import { auth } from "../middleware/auth";

const router = Router();

const controller = new TaskController();

router.get("/", auth, controller.getAll);

router.post("/", auth, controller.create);

router.put("/:id", auth, controller.update);

router.delete("/:id", auth, controller.delete);

export default router;
