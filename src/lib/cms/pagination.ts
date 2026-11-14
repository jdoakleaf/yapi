/**
 * src/lib/cms/pagination.ts
 * Ortak sayfalama, sıralama ve filtreleme yardımcıları.
 */

export interface PaginationInput {
  page?: number | string;
  pageSize?: number | string;
}

export interface PaginationResult {
  page: number;
  pageSize: number;
  skip: number;
  take: number;
}

export function parsePagination(
  input: PaginationInput,
  defaults: { pageSize?: number; maxPageSize?: number } = {}
): PaginationResult {
  const pageSize = Math.min(
    defaults.maxPageSize ?? 100,
    Math.max(1, Number(input.pageSize) || defaults.pageSize || 20)
  );
  const page = Math.max(1, Number(input.page) || 1);

  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function buildPaginatedResponse<T>(
  items: T[],
  total: number,
  pagination: PaginationResult
): PaginatedResponse<T> {
  return {
    items,
    pagination: {
      page: pagination.page,
      pageSize: pagination.pageSize,
      total,
      totalPages: Math.ceil(total / pagination.pageSize),
      hasNext: pagination.page * pagination.pageSize < total,
      hasPrev: pagination.page > 1,
    },
  };
}

// ─── SIRALAMA ────────────────────────────────────────────────────────────────

export type SortOrder = "asc" | "desc";

export function parseSortOrder(value?: string): SortOrder {
  return value === "asc" ? "asc" : "desc";
}

export function buildOrderBy<T extends string>(
  sortBy: T | undefined,
  sortOrder: SortOrder,
  allowedFields: T[],
  defaultField: T
): Record<string, SortOrder> {
  const field = allowedFields.includes(sortBy as T) ? sortBy! : defaultField;
  return { [field]: sortOrder };
}
