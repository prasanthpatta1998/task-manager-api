import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import {
  createTaskHandler,
  deleteTaskHandler,
  getTaskHandler,
  listTasksHandler,
  updateTaskHandler
} from "./task.controller";

export const taskRouter = Router();

taskRouter.use(authenticate);
taskRouter.post("/", createTaskHandler);
taskRouter.get("/", listTasksHandler);
taskRouter.get("/:id", getTaskHandler);
taskRouter.patch("/:id", updateTaskHandler);
taskRouter.delete("/:id", deleteTaskHandler);
