import { describe, expect, it } from "vitest";
import { createTaskSchema, listTasksQuerySchema, updateTaskSchema } from "../../src/modules/tasks/task.schema";

describe("task schemas", () => {
  it("accepts a valid task and applies optional defaults only in the model", () => {
    expect(createTaskSchema.parse({ title: "  Write API tests  " })).toEqual({ title: "Write API tests" });
  });

  it("rejects a blank title", () => {
    expect(createTaskSchema.safeParse({ title: "   " }).success).toBe(false);
  });

  it("rejects unknown client-supplied owner fields", () => {
    expect(createTaskSchema.safeParse({ title: "Task", ownerId: "someone-else" }).success).toBe(false);
  });

  it("requires at least one update field", () => {
    expect(updateTaskSchema.safeParse({}).success).toBe(false);
  });

  it("parses pagination and caps page size", () => {
    expect(listTasksQuerySchema.parse({ page: "2", limit: "50" })).toMatchObject({ page: 2, limit: 50 });
    expect(listTasksQuerySchema.safeParse({ limit: "101" }).success).toBe(false);
  });
});
