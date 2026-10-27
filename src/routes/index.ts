import { Router } from "express";
import { API_PREFIX } from "../common/constants";
import { authRouter } from "../modules/auth/auth.routes";
import { taskRouter } from "../modules/tasks/task.routes";

export const apiRouter = Router();

apiRouter.get("/", (_req, res) => {
  res.status(200).json({
    data: {
      name: "task-manager-api",
      version: "1.0.0",
      apiPrefix: API_PREFIX
    }
  });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/tasks", taskRouter);
