/**
 * HTTP client wrapper for the WordPress REST API.
 * Centralises URL construction, error handling, and header
 * extraction (pagination total counts live in response headers).
 */

import { Config } from '../constants/config';
import type { ApiError } from './types';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private buildUrl(path: string, params?: Record<string, string>): string {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          url.searchParams.append(key, value);
        }
      });
    }
    return url.toString();
  }

  async get<T>(
    path: string,
    params?: Record<string, string>,
  ): Promise<{ data: T; totalItems: number; totalPages: number }> {
    const url = this.buildUrl(path, params);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const apiError: ApiError = {
        code: errorBody.code ?? 'unknown_error',
        message: errorBody.message ?? `HTTP ${response.status}`,
        status: response.status,
      };
      throw apiError;
    }

    const data = (await response.json()) as T;
    const totalItems = Number(response.headers.get('X-WP-Total') ?? '0');
    const totalPages = Number(response.headers.get('X-WP-TotalPages') ?? '0');

    return { data, totalItems, totalPages };
  }
}

export const apiClient = new ApiClient(Config.WP_API_URL);
