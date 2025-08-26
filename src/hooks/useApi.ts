import { useState, useEffect, useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  mutate: () => void;
}

export function useApi<T>(
  endpoint: string | null,
  options?: RequestInit
): ApiState<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
    mutate: () => {},
  });

  const fetchData = useCallback(
    async (isRevalidation = false) => {
      // Si el endpoint es nulo, no hacemos nada.
      if (!endpoint) {
        setState((prev) => ({ ...prev, loading: false, data: null }));
        return;
      }

      if (!isRevalidation) {
        setState((prev) => ({ ...prev, loading: true, error: null }));
      }

      const token = localStorage.getItem("auth_token");

      try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
          ...options,
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options?.headers,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setState((prev) => ({ ...prev, data, loading: false, error: null }));
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: error.message,
          }));
        }
      }
    },
    [endpoint, options]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, mutate: () => fetchData(true) };
}

export async function apiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const token = localStorage.getItem("auth_token");

  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}
