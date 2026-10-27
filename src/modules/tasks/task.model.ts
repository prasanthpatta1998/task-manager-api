import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

export const TASK_STATUSES = ["todo", "in_progress", "done"] as const;
export const TASK_PRIORITIES = ["low", "medium", "high"] as const;

const taskSchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, trim: true, maxlength: 5000, default: "" },
  status: { type: String, enum: TASK_STATUSES, default: "todo", required: true },
  priority: { type: String, enum: TASK_PRIORITIES, default: "medium", required: true },
  dueDate: { type: Date, default: null },
  ownerId: { type: String, required: true, index: true }
}, { timestamps: true, versionKey: false });

taskSchema.index({ ownerId: 1, createdAt: -1 });

export type TaskDocument = InferSchemaType<typeof taskSchema>;

const TaskModel = (models.Task ?? model<TaskDocument>("Task", taskSchema)) as Model<TaskDocument>;

export const Task = TaskModel;
