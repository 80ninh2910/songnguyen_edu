export function success<T>(data: T): { success: true; data: T } {
  return { success: true, data };
}

export function successList<T>(data: T[], meta: {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}): { success: true; data: T[]; meta: typeof meta } {
  return { success: true, data, meta };
}
