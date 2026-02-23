/**
 * WordPress REST API service.
 * Each function maps to a specific endpoint and returns clean
 * typed data via the mapper layer. Pagination metadata is
 * preserved for infinite-scroll queries.
 */

import { Config } from '../constants/config';
import { apiClient } from './client';
import { mapCategories, mapPost, mapPosts } from './mappers';
import type {
  AppCategory,
  AppPost,
  PaginatedResponse,
  PostsQueryParams,
  WPCategory,
  WPPost,
} from './types';

export async function fetchPosts(
  params: PostsQueryParams,
): Promise<PaginatedResponse<AppPost>> {
  const queryParams: Record<string, string> = {
    page: String(params.page),
    per_page: String(params.perPage),
    _embed: '1',
    orderby: 'date',
    order: 'desc',
  };

  if (params.categoryId) {
    queryParams.categories = String(params.categoryId);
  }
  if (params.search) {
    queryParams.search = params.search;
  }

  const { data, totalItems, totalPages } = await apiClient.get<WPPost[]>(
    '/posts',
    queryParams,
  );

  return {
    data: mapPosts(data),
    totalItems,
    totalPages,
  };
}

export async function fetchPost(id: number): Promise<AppPost> {
  const { data } = await apiClient.get<WPPost>(`/posts/${id}`, {
    _embed: '1',
  });
  return mapPost(data);
}

export async function fetchCategories(): Promise<AppCategory[]> {
  const { data } = await apiClient.get<WPCategory[]>('/categories', {
    per_page: '100',
    orderby: 'count',
    order: 'desc',
    hide_empty: 'true',
  });
  return mapCategories(data);
}

export async function fetchCategoryById(id: number): Promise<AppCategory> {
  const { data } = await apiClient.get<WPCategory>(`/categories/${id}`);
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    count: data.count,
    parentId: data.parent,
  };
}

export async function searchPosts(
  query: string,
  page = 1,
): Promise<PaginatedResponse<AppPost>> {
  return fetchPosts({
    page,
    perPage: Config.POSTS_PER_PAGE,
    search: query,
    embed: true,
  });
}
