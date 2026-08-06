import type { Task } from "../types/Task";
import type { ApiResult } from "../types/Common";
import { Url } from "../types/Common";

export async function getTasks(token: string): Promise<ApiResult<Task[]>> {
  const url = `${Url}/tasks/`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return { success: false, message: `Error ${response.status}: ${text}` };
    }

    const body = await response.json();
    const tasks = body.data || body;

    if (!Array.isArray(tasks)) {
      return { success: false, message: "Invalid tasks data format" };
    }

    return { success: true, data: tasks };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch tasks",
    };
  }
}

export async function createTask(
  token: string,
  task: Omit<Task, "id">,
): Promise<ApiResult<Task>> {
  const url = `${Url}/tasks/`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      const text = await response.text();
      return { success: false, message: `Error ${response.status}: ${text}` };
    }

    const body = await response.json();
    return { success: true, data: body };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create task",
    };
  }
}

export async function updateTask(
  token: string,
  id: string,
  task: Partial<Task>,
): Promise<ApiResult<Task>> {
  const url = `${Url}/tasks/${id}`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      const text = await response.text();
      return { success: false, message: `Error ${response.status}: ${text}` };
    }

    const body = await response.json();
    return { success: true, data: body };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update task",
    };
  }
}

export async function deleteTask(
  token: string,
  id: string,
): Promise<ApiResult<void>> {
  const url = `${Url}/tasks/${id}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return { success: false, message: `Error ${response.status}: ${text}` };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete task",
    };
  }
}
