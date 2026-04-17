export function parsePagination(input: { page?: string | number; limit?: string | number }): {
  page: number;
  limit: number;
  skip: number;
} {
  const page = Math.max(1, Number(input.page ?? 1));
  const limit = Math.min(100, Math.max(1, Number(input.limit ?? 20)));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export function buildMeta(page: number, limit: number, total: number): {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
} {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}
