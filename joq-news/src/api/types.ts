/**
 * WordPress REST API response types and clean app models.
 * The raw WP shapes live here alongside the domain models
 * that the UI actually consumes via the mapper layer.
 */

// ─── Raw WordPress REST API Types ──────────────────────────

export interface WPRendered {
  rendered: string;
}

export interface WPFeaturedMedia {
  id: number;
  source_url: string;
  media_details?: {
    width: number;
    height: number;
    sizes?: {
      medium?: { source_url: string; width: number; height: number };
      large?: { source_url: string; width: number; height: number };
      full?: { source_url: string; width: number; height: number };
      thumbnail?: { source_url: string; width: number; height: number };
    };
  };
  alt_text?: string;
}

export interface WPAuthor {
  id: number;
  name: string;
  avatar_urls?: Record<string, string>;
}

export interface WPTerm {
  id: number;
  name: string;
  slug: string;
}

export interface WPPost {
  id: number;
  date: string;
  modified: string;
  slug: string;
  status: string;
  title: WPRendered;
  content: WPRendered;
  excerpt: WPRendered;
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  link: string;
  _embedded?: {
    'wp:featuredmedia'?: WPFeaturedMedia[];
    'wp:term'?: WPTerm[][];
    author?: WPAuthor[];
  };
}

export interface WPCategory {
  id: number;
  count: number;
  description: string;
  name: string;
  slug: string;
  parent: number;
}

export interface WPMedia {
  id: number;
  source_url: string;
  alt_text: string;
  media_details: {
    width: number;
    height: number;
  };
}

export interface WPSearchResult {
  id: number;
  title: string;
  url: string;
  type: string;
  subtype: string;
}

// ─── Clean App Models ──────────────────────────────────────

export interface AppPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  date: string;
  modified: string;
  authorName: string;
  authorAvatar: string | null;
  featuredImage: string | null;
  featuredImageLarge: string | null;
  featuredImageAlt: string;
  categoryIds: number[];
  categoryNames: string[];
  tagIds: number[];
  link: string;
}

export interface AppCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
  parentId: number;
}

// ─── API Helpers ───────────────────────────────────────────

export interface PaginationParams {
  page: number;
  perPage: number;
}

export interface PostsQueryParams extends PaginationParams {
  categoryId?: number;
  search?: string;
  embed?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  status: number;
}
