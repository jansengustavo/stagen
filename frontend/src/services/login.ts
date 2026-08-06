import type { Login, LoginResponse } from "../types/Login";
import type { ApiResult } from "../types/Common";
import { Url } from "../types/Common";

export async function performLogin({
  email,
  password,
}: Login): Promise<ApiResult<LoginResponse>> {
  const url = `${Url}/users/login`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const text = await response.text();
    return { success: false, message: `Error ${response.status}: ${text}` };
  }

  const body = await response.json();
  const token = body.token;
  const userId = body.userId;
  if (!token) {
    return { success: false, message: "Failed to get token" };
  }

  return { success: true, data: { token, userId } };
}
