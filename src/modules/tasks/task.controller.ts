import type { Request, Response } from "express";
import { AppError } from "../../common/errors/app-error";
import { asyncHandler } from "../../common/utils/async-handler";
import { createTaskSchema, listTasksQuerySchema, updateTaskSchema } from "./task.schema";
import { createTask, deleteTask, getTask, listTasks, updateTask } from "./task.service";

function getOwnerId(req: Request): string {
  if (!req.auth?.sub) throw new AppError(401, "Authentication required", "UNAUTHENTICATED");
  return req.auth.sub;
}

export const createTaskHandler = asyncHandler(async (req, res) => {
  const input = createTaskSchema.parse(req.body);
  const task = await createTask(getOwnerId(req), input);
  res.status(201).json({ data: task });
});

export const listTasksHandler = asyncHandler(async (req, res) => {
  const query = listTasksQuerySchema.parse(req.query);
  const result = await listTasks(getOwnerId(req), query);
  res.status(200).json({ data: result });
});

function getTaskIdParam(req: Request): string {
  const taskId = req.params.id;
  if (typeof taskId === "string" && taskId.length > 0) return taskId;
  throw new AppError(400, "Task ID is required", "INVALID_TASK_ID");
}

export const getTaskHandler = asyncHandler(async (req, res) => {
  const task = await getTask(getOwnerId(req), getTaskIdParam(req));
  res.status(200).json({ data: task });
});

export const updateTaskHandler = asyncHandler(async (req, res) => {
  const input = updateTaskSchema.parse(req.body);
  const task = await updateTask(getOwnerId(req), getTaskIdParam(req), input);
  res.status(200).json({ data: task });
});

export const deleteTaskHandler = asyncHandler(async (req, res) => {
  await deleteTask(getOwnerId(req), getTaskIdParam(req));
  res.status(204).send();
});
