import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
} from "@/lib/adminAuth";

const DEFAULT_API_BASE_URL = "http://localhost:3000/api/v1";

type ApiSuccess<T> = { success: true; data: T };
type ApiSuccessList<T> = {
  success: true;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type AdminDashboardResponse = {
  stats: {
    pendingTutors: number;
    pendingRequests: number;
    openClasses: number;
    pendingPayments: number;
  };
  recentAudit: Array<{
    id: string;
    action: string;
    targetType: string;
    targetId: string;
    actorName: string;
    createdAt: string;
  }>;
  matchingRate: {
    success: number;
    rejected: number;
    pending: number;
    total: number;
    percent: number;
  };
  topTutors: Array<{
    id: string;
    fullName: string;
    subjects: string[];
    lessonCount: number;
  }>;
  systemHealth: Array<{
    service: string;
    status: string;
    ratio: string;
  }>;
};

export type AdminLoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    role: "ADMIN" | "SUPERADMIN";
    email: string;
    fullName: string;
  };
};

export type AdminTutorStatus = "PENDING" | "APPROVED" | "REJECTED";

export type AdminTutorSummary = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  status: AdminTutorStatus;
  subjects: string[];
  districts: string[];
  createdAt: string;
  approvedAt: string | null;
};

export type AdminTutorDetail = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  status: AdminTutorStatus;
  subjects: string[];
  districts: string[];
  rejectReason: string | null;
  approvedAt: string | null;
  approvedBy: { id: string; fullName: string } | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    applications: number;
    assignments: number;
    payments: number;
  };
};

export type AdminClassRequestStatus = "PENDING" | "CONVERTED" | "REJECTED";

export type AdminClassRequestSummary = {
  id: string;
  parentName: string;
  parentPhone: string;
  subject: string;
  grade: string;
  district: string;
  budgetPerHour: number;
  status: AdminClassRequestStatus;
  createdAt: string;
};

export type AdminClassRequestMember = {
  id: string;
  studentName: string;
  studentGrade: string | null;
  parentName: string;
  parentPhone: string;
  parentEmail: string | null;
  address: string | null;
  classId: string | null;
};

export type AdminClassRequestDetail = {
  id: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string | null;
  subject: string;
  grade: string;
  district: string;
  budgetPerHour: number;
  note: string | null;
  status: AdminClassRequestStatus;
  processedAt: string | null;
  createdAt: string;
  updatedAt: string;
  processedBy: { id: string; fullName: string } | null;
  members: AdminClassRequestMember[];
  classes: Array<{
    id: string;
    title: string;
    status: string;
    createdAt: string;
  }>;
};

export type AdminClassStatus = "OPEN" | "ASSIGNED" | "CLOSED";

export type AdminClassSummary = {
  id: string;
  title: string;
  subject: string;
  grade: string;
  district: string;
  feePerHour: number;
  status: AdminClassStatus;
  createdAt: string;
  _count: {
    applications: number;
    members: number;
  };
};

export type AdminClassMember = {
  id: string;
  studentName: string;
  studentGrade: string | null;
  parentName: string;
  parentPhone: string;
  parentEmail: string | null;
  address: string | null;
};

export type AdminClassDetail = {
  id: string;
  title: string;
  subject: string;
  grade: string;
  district: string;
  feePerHour: number;
  schedule: string | null;
  status: AdminClassStatus;
  createdAt: string;
  closedAt: string | null;
  sourceRequest: {
    id: string;
    status: AdminClassRequestStatus;
    parentName: string;
    parentPhone: string;
    subject: string;
    grade: string;
    district: string;
    budgetPerHour: number;
    createdAt: string;
  } | null;
  members: AdminClassMember[];
  payments: Array<{
    id: string;
    status: string;
    amount: number;
    attemptCount: number;
    createdAt: string;
  }>;
  assignment: {
    id: string;
    note: string | null;
    createdAt: string;
    tutor: {
      id: string;
      fullName: string;
      email: string;
    };
    assignedBy: {
      id: string;
      fullName: string;
    };
  } | null;
  _count: {
    applications: number;
  };
};

export type AdminTutorCreatePayload = {
  fullName: string;
  email: string;
  phone?: string;
  subjects: string[];
  districts: string[];
};

export type AdminTutorUpdatePayload = Partial<AdminTutorCreatePayload>;

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL ?? DEFAULT_API_BASE_URL;
}

async function parseJson<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T;
  return data;
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  const response = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    clearAuthTokens();
    return null;
  }

  const payload =
    await parseJson<ApiSuccess<{ accessToken: string }>>(response);

  if (!payload?.data?.accessToken) {
    clearAuthTokens();
    return null;
  }

  setAccessToken(payload.data.accessToken);
  return payload.data.accessToken;
}

async function adminFetch(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<Response> {
  const headers = new Headers(options.headers ?? {});

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const accessToken = getAccessToken();
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && retry) {
    const refreshedToken = await refreshAccessToken();
    if (refreshedToken) {
      const retryHeaders = new Headers(headers);
      retryHeaders.set("Authorization", `Bearer ${refreshedToken}`);
      return fetch(`${getApiBaseUrl()}${path}`, {
        ...options,
        headers: retryHeaders,
      });
    }
  }

  if (response.status === 401) {
    clearAuthTokens();
  }

  return response;
}

export async function loginAdmin(
  email: string,
  password: string,
): Promise<AdminLoginResponse> {
  const response = await fetch(`${getApiBaseUrl()}/auth/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Đăng nhập thất bại. Vui lòng kiểm tra thông tin.");
  }

  const payload = await parseJson<ApiSuccess<AdminLoginResponse>>(response);
  return payload.data;
}

export async function fetchAdminDashboard(): Promise<AdminDashboardResponse> {
  const response = await adminFetch("/admin/dashboard");

  if (!response.ok) {
    throw new Error("Không thể tải dữ liệu dashboard.");
  }

  const payload = await parseJson<ApiSuccess<AdminDashboardResponse>>(response);
  return payload.data;
}

export async function listAdminTutors(params: {
  page?: number;
  limit?: number;
  status?: AdminTutorStatus;
  search?: string;
  phone?: string;
  subject?: string;
  subjects?: string[];
  district?: string;
  districts?: string[];
  sort?: "newest" | "active-most" | "rating";
}): Promise<{
  data: AdminTutorSummary[];
  meta: ApiSuccessList<unknown>["meta"];
}> {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.status) searchParams.set("status", params.status);
  if (params.search) searchParams.set("search", params.search);
  if (params.phone) searchParams.set("phone", params.phone);
  if (params.subject) searchParams.set("subject", params.subject);
  if (params.subjects?.length) {
    searchParams.set("subjects", params.subjects.join(","));
  }
  if (params.district) searchParams.set("district", params.district);
  if (params.districts?.length) {
    searchParams.set("districts", params.districts.join(","));
  }
  if (params.sort) searchParams.set("sort", params.sort);

  const queryString = searchParams.toString();
  const response = await adminFetch(
    `/admin/tutors${queryString ? `?${queryString}` : ""}`,
  );

  if (!response.ok) {
    throw new Error("Không thể tải danh sách gia sư.");
  }

  const payload = await parseJson<ApiSuccessList<AdminTutorSummary>>(response);
  return { data: payload.data, meta: payload.meta };
}

export async function getAdminTutorById(id: string): Promise<AdminTutorDetail> {
  const response = await adminFetch(`/admin/tutors/${id}`);

  if (!response.ok) {
    throw new Error("Không thể tải hồ sơ gia sư.");
  }

  const payload = await parseJson<ApiSuccess<AdminTutorDetail>>(response);
  return payload.data;
}

export async function listAdminClassRequests(params: {
  page?: number;
  limit?: number;
  status?: AdminClassRequestStatus;
}): Promise<{
  data: AdminClassRequestSummary[];
  meta: ApiSuccessList<unknown>["meta"];
}> {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.status) searchParams.set("status", params.status);

  const queryString = searchParams.toString();
  const response = await adminFetch(
    `/admin/class-requests${queryString ? `?${queryString}` : ""}`,
  );

  if (!response.ok) {
    throw new Error("Không thể tải danh sách yêu cầu mở lớp.");
  }

  const payload =
    await parseJson<ApiSuccessList<AdminClassRequestSummary>>(response);
  return { data: payload.data, meta: payload.meta };
}

export async function getAdminClassRequestById(
  id: string,
): Promise<AdminClassRequestDetail> {
  const response = await adminFetch(`/admin/class-requests/${id}`);

  if (!response.ok) {
    throw new Error("Không thể tải chi tiết yêu cầu mở lớp.");
  }

  const payload =
    await parseJson<ApiSuccess<AdminClassRequestDetail>>(response);
  return payload.data;
}

export async function convertAdminClassRequest(
  id: string,
  payload: { title?: string; feePerHour?: number; schedule?: string },
): Promise<{ classId: string; converted: true }> {
  const response = await adminFetch(`/admin/class-requests/${id}/convert`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Không thể tạo lớp từ yêu cầu này.");
  }

  const data =
    await parseJson<ApiSuccess<{ classId: string; converted: true }>>(response);
  return data.data;
}

export async function rejectAdminClassRequest(
  id: string,
  reason: string,
): Promise<void> {
  const response = await adminFetch(`/admin/class-requests/${id}/reject`, {
    method: "PATCH",
    body: JSON.stringify({ reason }),
  });

  if (!response.ok) {
    throw new Error("Không thể từ chối yêu cầu này.");
  }
}

export async function listAdminClasses(params: {
  page?: number;
  limit?: number;
  status?: AdminClassStatus;
  subject?: string;
  district?: string;
}): Promise<{
  data: AdminClassSummary[];
  meta: ApiSuccessList<unknown>["meta"];
}> {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.status) searchParams.set("status", params.status);
  if (params.subject) searchParams.set("subject", params.subject);
  if (params.district) searchParams.set("district", params.district);

  const queryString = searchParams.toString();
  const response = await adminFetch(
    `/admin/classes${queryString ? `?${queryString}` : ""}`,
  );

  if (!response.ok) {
    throw new Error("Không thể tải danh sách lớp học.");
  }

  const payload = await parseJson<ApiSuccessList<AdminClassSummary>>(response);
  return { data: payload.data, meta: payload.meta };
}

export async function getAdminClassById(id: string): Promise<AdminClassDetail> {
  const response = await adminFetch(`/admin/classes/${id}`);

  if (!response.ok) {
    throw new Error("Không thể tải chi tiết lớp học.");
  }

  const payload = await parseJson<ApiSuccess<AdminClassDetail>>(response);
  return payload.data;
}

export async function createAdminClass(payload: {
  title: string;
  subject: string;
  grade: string;
  district: string;
  feePerHour: number;
  schedule?: string;
  sourceRequestId?: string;
}): Promise<{ id: string }> {
  const response = await adminFetch("/admin/classes", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Không thể tạo lớp học mới.");
  }

  const data = await parseJson<ApiSuccess<{ id: string }>>(response);
  return data.data;
}

export async function updateAdminClass(
  id: string,
  payload: {
    title?: string;
    feePerHour?: number;
    schedule?: string;
  },
): Promise<AdminClassDetail> {
  const response = await adminFetch(`/admin/classes/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Không thể cập nhật lớp học.");
  }

  const data = await parseJson<ApiSuccess<AdminClassDetail>>(response);
  return data.data;
}

export async function closeAdminClass(id: string): Promise<void> {
  const response = await adminFetch(`/admin/classes/${id}/close`, {
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error("Không thể đóng lớp học.");
  }
}

export async function createAdminTutor(
  payload: AdminTutorCreatePayload,
): Promise<{ id: string }> {
  const response = await adminFetch("/admin/tutors", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error("Email gia sư đã tồn tại.");
    }
    throw new Error("Không thể tạo gia sư mới.");
  }

  const data = await parseJson<ApiSuccess<{ id: string }>>(response);
  return data.data;
}

export async function updateAdminTutor(
  id: string,
  payload: AdminTutorUpdatePayload,
): Promise<AdminTutorDetail> {
  const response = await adminFetch(`/admin/tutors/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error("Email gia sư đã tồn tại.");
    }
    throw new Error("Không thể cập nhật hồ sơ gia sư.");
  }

  const data = await parseJson<ApiSuccess<AdminTutorDetail>>(response);
  return data.data;
}

export async function approveAdminTutor(id: string): Promise<void> {
  const response = await adminFetch(`/admin/tutors/${id}/approve`, {
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error("Không thể duyệt gia sư.");
  }
}

export async function rejectAdminTutor(
  id: string,
  reason: string,
): Promise<void> {
  const response = await adminFetch(`/admin/tutors/${id}/reject`, {
    method: "PATCH",
    body: JSON.stringify({ reason }),
  });

  if (!response.ok) {
    throw new Error("Không thể từ chối gia sư.");
  }
}
