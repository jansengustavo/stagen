export type ApiResult<T> = { success: boolean; data?: T; message?: string };

export const Url = import.meta.env.VITE_API_URL;
