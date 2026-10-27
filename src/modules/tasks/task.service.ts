import mongoose from "mongoose";
import { AppError } from "../../common/errors/app-error";
import { Task } from "./task.model";
import type { CreateTaskInput, UpdateTaskInput } from "./task.schema";

export async function createTask(ownerId: string, input: CreateTaskInput) {
  const task = await Task.create({ ...input, ownerId });
  return task.toJSON();
}

export async function listTasks(
  ownerId: string,
  options: { page: number; limit: number; status?: string; priority?: string }
) {
  const filter: Record<string, unknown> = { ownerId };
  if (options.status) filter.status = options.status;
  if (options.priority) filter.priority = options.priority;

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip((options.page - 1) * options.limit)
      .limit(options.limit)
      .lean(),
    Task.countDocuments(filter)
  ]);

  return {
    items: tasks,
    pagination: {
      page: options.page,
      limit: options.limit,
      total,
      totalPages: Math.ceil(total / options.limit)
    }
  };
}

export async function getTask(ownerId: string, taskId: string) {
  assertValidTaskId(taskId);
  const task = await Task.findOne({ _id: taskId, ownerId }).lean();
  if (!task) throw new AppError(404, "Task not found", "TASK_NOT_FOUND");
  return task;
}

export async function updateTask(ownerId: string, taskId: string, input: UpdateTaskInput) {
  assertValidTaskId(taskId);
  const task = await Task.findOneAndUpdate(
    { _id: taskId, ownerId },
    { $set: input },
    { new: true, runValidators: true }
  ).lean();
  if (!task) throw new AppError(404, "Task not found", "TASK_NOT_FOUND");
  return task;
}

export async function deleteTask(ownerId: string, taskId: string) {
  assertValidTaskId(taskId);
  const task = await Task.findOneAndDelete({ _id: taskId, ownerId }).lean();
  if (!task) throw new AppError(404, "Task not found", "TASK_NOT_FOUND");
}

function assertValidTaskId(taskId: string) {
  if (!mongoose.isValidObjectId(taskId)) {
    throw new AppError(400, "Invalid task ID", "INVALID_TASK_ID");
  }
}
