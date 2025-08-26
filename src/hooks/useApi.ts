import { useState, useEffect, useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  manualFetch: () => void;
}

// Custom hook for API calls
export function useApi<T>(
  endpoint: string,
  options?: RequestInit
): ApiState<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
    manualFetch: () => {},
  });

  const fetchData = useCallback(async () => {
    const controller = new AbortController();
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options?.headers,
        },
        signal: controller.signal,
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

    return () => controller.abort();
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, manualFetch: fetchData };
}

// Standalone API call function
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
