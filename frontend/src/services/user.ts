import type { User } from "../types/User";
import type { ApiResult } from "../types/Common";
import { Url } from "../types/Common";

export async function getUser(
  token: string,
  id: string,
): Promise<ApiResult<User>> {
  const url = `${Url}/users/${id}`;

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
    const user = body.data || body;

    if (!user) {
      return { success: false, message: "Invalid users data format" };
    }

    return { success: true, data: user };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch users",
    };
  }
}

export async function createUser(user: {
  email: string;
  name: string;
  password: string;
}): Promise<ApiResult<User>> {
  const url = `${Url}/users`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
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
      message: error instanceof Error ? error.message : "Failed to create user",
    };
  }
}

export async function updateUser(
  token: string,
  id: string,
  user: Partial<User>,
): Promise<ApiResult<User>> {
  const url = `${Url}/users/${id}`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
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
      message: error instanceof Error ? error.message : "Failed to update user",
    };
  }
}

export async function deleteUser(
  token: string,
  id: string,
): Promise<ApiResult<void>> {
  const url = `${Url}/users/${id}`;

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
      message: error instanceof Error ? error.message : "Failed to delete user",
    };
  }
}
