export class ApiError extends Error {
    status: number;
    code: string;

    constructor(status: number, code: string, message: string) {
        super(message);
        this.status = status;
        this.code = code;
    }
}
export async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const API_BASE_URL = import.meta.env.VITE_URL;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
        ...options,
    });

    if (!response.ok) {
        const errorBody = await response.json();

        throw new ApiError(errorBody.error.status, errorBody.error.code, errorBody.error.message);
    }

    return response.json();
}
