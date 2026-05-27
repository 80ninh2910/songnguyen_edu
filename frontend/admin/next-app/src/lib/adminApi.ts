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
  tutorType?: AdminTutorType;
  subjects: string[];
  districts: string[];
  mustChangePassword?: boolean;
  createdAt: string;
  approvedAt: string | null;
};

export type AdminTutorDetail = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  status: AdminTutorStatus;
  tutorType?: AdminTutorType;
  subjects: string[];
  districts: string[];
  mustChangePassword?: boolean;
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
export type AdminRequestType = "GIA_SU_TU_DO" | "GIA_SU_DAO_TAO" | "TRUNG_TAM";
export type AdminTutorType =
  | "GIA_SU_TU_DO"
  | "GIA_SU_DAO_TAO"
  | "GIAO_VIEN_TRUNG_TAM"
  | "ANY";
export type AdminClassType =
  | "LOP_GIA_SU_TU_DO"
  | "LOP_GIA_SU_DAO_TAO"
  | "LOP_TRUNG_TAM";

export type AdminClassRequestSummary = {
  id: string;
  parentName: string;
  parentPhone: string;
  subject: string;
  grade: string;
  district: string;
  budgetPerHour: number;
  requestType: AdminRequestType;
  tutorType: AdminTutorType;
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
  requestType: AdminRequestType;
  tutorType: AdminTutorType;
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
  assignedClass: {
    id: string;
    title: string;
    status: string;
    createdAt: string;
  } | null;
};

export type AdminClassStatus = "OPEN" | "ASSIGNED" | "CLOSED";

export type AdminClassSummary = {
  id: string;
  title: string;
  subject: string;
  grade: string;
  district: string;
  feePerHour: number;
  classType: AdminClassType;
  tutorType: AdminTutorType;
  centerTeacherId: string | null;
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

export type AdminClassMemberInput = {
  studentName: string;
  studentGrade?: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  address?: string;
};

export type AdminClassDetail = {
  id: string;
  title: string;
  subject: string;
  grade: string;
  district: string;
  feePerHour: number;
  schedule: string | null;
  classType: AdminClassType;
  tutorType: AdminTutorType;
  centerTeacherId: string | null;
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

export type AdminClassSession = {
  id: string;
  sessionNumber: number;
  sessionDate: string;
  startTime: string | null;
  endTime: string | null;
  topic: string | null;
  notes: string | null;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  tutor?: { id: string; fullName: string } | null;
  feedbackCount: number;
  totalMembers: number;
};

export type AdminClassSessionsResponse = {
  class: {
    id: string;
    title: string;
    subject: string;
    grade: string;
    district: string;
  };
  memberCount: number;
  sessions: AdminClassSession[];
};

export type AdminSessionFeedback = {
  id: string;
  memberId: string;
  attendance: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  attitudeScore: number | null;
  comprehensionScore: number | null;
  homeworkScore: number | null;
  strengths: string | null;
  weaknesses: string | null;
  recommendation: string | null;
  overallComment: string | null;
  createdAt: string;
  updatedAt: string;
  member: {
    studentName: string;
    parentName: string | null;
    parentPhone: string | null;
  };
  tutor: { id: string; fullName: string };
};

export type AdminSessionFeedbacksResponse = {
  session: {
    id: string;
    sessionNumber: number;
    sessionDate: string;
    classId: string;
  };
  feedbacks: AdminSessionFeedback[];
};

export type AdminClassApplicant = {
  id: string;
  status: string;
  note: string | null;
  createdAt: string;
  tutor: {
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
    subjects: string[];
    districts: string[];
    status: string;
  };
};

export type AdminTutorCreatePayload = {
  fullName: string;
  email: string;
  phone?: string;
  subjects: string[];
  districts: string[];
  tutorType?: AdminTutorType;
};

export type AdminTutorUpdatePayload = Partial<AdminTutorCreatePayload>;

export type AdminCenterTeacherStatus = "ACTIVE" | "INACTIVE";

export type AdminCenterTeacherSummary = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  status: AdminCenterTeacherStatus;
  subjects: string[];
  districts: string[];
  createdAt: string;
  updatedAt: string;
};

export type AdminCenterTeacherCreatePayload = {
  fullName: string;
  email: string;
  phone?: string;
  subjects: string[];
  districts: string[];
  status?: AdminCenterTeacherStatus;
};

export type AdminCenterTeacherUpdatePayload =
  Partial<AdminCenterTeacherCreatePayload>;

function getApiBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    DEFAULT_API_BASE_URL;

  return raw.replace(/\/$/, "");
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
    if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
      window.location.href = "/login";
    }
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

export async function listAdminCenterTeachers(params: {
  page?: number;
  limit?: number;
  status?: AdminCenterTeacherStatus;
  subject?: string;
  subjects?: string[];
  district?: string;
  districts?: string[];
  search?: string;
  phone?: string;
}): Promise<{
  data: AdminCenterTeacherSummary[];
  meta: ApiSuccessList<unknown>["meta"];
}> {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.status) searchParams.set("status", params.status);
  if (params.subject) searchParams.set("subject", params.subject);
  if (params.search) searchParams.set("search", params.search);
  if (params.phone) searchParams.set("phone", params.phone);
  if (params.district) searchParams.set("district", params.district);
  if (params.subjects) searchParams.set("subjects", params.subjects.join(","));
  if (params.districts) searchParams.set("districts", params.districts.join(","));

  const queryString = searchParams.toString();
  const response = await adminFetch(
    `/admin/center-teachers${queryString ? `?${queryString}` : ""}`,
  );

  if (!response.ok) {
    throw new Error("Không thể tải danh sách giáo viên trung tâm.");
  }

  const payload =
    await parseJson<ApiSuccessList<AdminCenterTeacherSummary>>(response);
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
  requestType?: AdminRequestType;
  tutorType?: AdminTutorType;
}): Promise<{
  data: AdminClassRequestSummary[];
  meta: ApiSuccessList<unknown>["meta"];
}> {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.status) searchParams.set("status", params.status);
  if (params.requestType) searchParams.set("requestType", params.requestType);
  if (params.tutorType) searchParams.set("tutorType", params.tutorType);

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
  payload: {
    title?: string;
    feePerHour?: number;
    schedule?: string;
    centerTeacherId?: string;
    classId?: string;
  },
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
  classType?: AdminClassType;
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
  if (params.classType) searchParams.set("classType", params.classType);

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

export async function listAdminClassApplicants(
  classId: string,
): Promise<AdminClassApplicant[]> {
  const response = await adminFetch(`/admin/classes/${classId}/applicants`);

  if (!response.ok) {
    throw new Error("Không thể tải danh sách ứng viên.");
  }

  const payload = await parseJson<ApiSuccess<AdminClassApplicant[]>>(response);
  return payload.data;
}

export async function listAdminClassSessions(
  classId: string,
): Promise<AdminClassSessionsResponse> {
  const response = await adminFetch(`/admin/classes/${classId}/sessions`);

  if (!response.ok) {
    throw new Error("Không thể tải danh sách buổi học.");
  }

  const payload = await parseJson<ApiSuccess<AdminClassSessionsResponse>>(
    response,
  );
  return payload.data;
}

export async function listAdminSessionFeedbacks(
  sessionId: string,
): Promise<AdminSessionFeedbacksResponse> {
  const response = await adminFetch(`/admin/sessions/${sessionId}/feedbacks`);

  if (!response.ok) {
    throw new Error("Không thể tải nhận xét buổi học.");
  }

  const payload = await parseJson<ApiSuccess<AdminSessionFeedbacksResponse>>(
    response,
  );
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
  classType?: AdminClassType;
  tutorType?: AdminTutorType;
  centerTeacherId?: string | null;
  members?: AdminClassMemberInput[];
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
    classType?: AdminClassType;
    tutorType?: AdminTutorType;
    centerTeacherId?: string | null;
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

export async function createAdminCenterTeacher(
  payload: AdminCenterTeacherCreatePayload,
): Promise<{ id: string }> {
  const response = await adminFetch("/admin/center-teachers", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Không thể tạo giáo viên trung tâm.");
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

export async function updateAdminCenterTeacher(
  id: string,
  payload: AdminCenterTeacherUpdatePayload,
): Promise<AdminCenterTeacherSummary> {
  const response = await adminFetch(`/admin/center-teachers/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Không thể cập nhật giáo viên trung tâm.");
  }

  const data = await parseJson<ApiSuccess<AdminCenterTeacherSummary>>(response);
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

export async function resetAdminTutorPassword(id: string): Promise<void> {
  const response = await adminFetch(`/admin/tutors/${id}/reset-password`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Không thể đặt lại mật khẩu gia sư.");
  }
}

export async function assignAdminClass(
  classId: string,
  tutorId: string,
  note?: string,
): Promise<void> {
  const response = await adminFetch(`/admin/classes/${classId}/assign`, {
    method: "POST",
    body: JSON.stringify({ tutorId, note }),
  });

  if (!response.ok) {
    const payload = await parseJson<{ error?: { message?: string } }>(response).catch(() => null);
    throw new Error(payload?.error?.message ?? "Không thể phân lớp cho gia sư.");
  }
}

export async function rejectAdminClassApplicant(
  classId: string,
  tutorId: string,
  note?: string,
): Promise<void> {
  const response = await adminFetch(
    `/admin/classes/${classId}/applicants/${tutorId}/reject`,
    {
      method: "PATCH",
      body: JSON.stringify({ note }),
    },
  );

  if (!response.ok) {
    const payload = await parseJson<{ error?: { message?: string } }>(response).catch(() => null);
    throw new Error(payload?.error?.message ?? "Không thể từ chối ứng viên.");
  }
}

export type AdminAuditLog = {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  targetType: string;
  targetId: string;
  payload: unknown;
  createdAt: string;
};

export async function fetchAdminAuditLogs(params: {
  page?: number;
  limit?: number;
  action?: string;
  targetType?: string;
  actorId?: string;
}): Promise<{
  data: AdminAuditLog[];
  meta: ApiSuccessList<unknown>["meta"];
}> {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.action) searchParams.set("action", params.action);
  if (params.targetType) searchParams.set("targetType", params.targetType);
  if (params.actorId) searchParams.set("actorId", params.actorId);

  const queryString = searchParams.toString();
  const response = await adminFetch(
    `/admin/audit-logs${queryString ? `?${queryString}` : ""}`,
  );

  if (!response.ok) {
    throw new Error("Không thể tải nhật ký hệ thống.");
  }

  const payload = await parseJson<ApiSuccessList<AdminAuditLog>>(response);
  return { data: payload.data, meta: payload.meta };
}

// ─── Admin Account CRUD (SUPERADMIN only) ─────────────────────────────────────

export type AdminAccount = {
  id: string;
  email: string;
  fullName: string;
  role: "ADMIN" | "SUPERADMIN";
  createdAt: string;
  updatedAt: string;
};

export async function fetchAdminAccounts(params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: "ADMIN" | "SUPERADMIN";
}): Promise<{ data: AdminAccount[]; meta: ApiSuccessList<unknown>["meta"] }> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);
  if (params.role) searchParams.set("role", params.role);

  const qs = searchParams.toString();
  const response = await adminFetch(`/admin/admin-accounts${qs ? `?${qs}` : ""}`);

  if (!response.ok) throw new Error("Không thể tải danh sách tài khoản admin.");

  const payload = await parseJson<ApiSuccessList<AdminAccount>>(response);
  return { data: payload.data, meta: payload.meta };
}

export async function createAdminAccount(body: {
  email: string;
  fullName: string;
  role: "ADMIN" | "SUPERADMIN";
  password: string;
}): Promise<{ id: string }> {
  const response = await adminFetch("/admin/admin-accounts", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const payload = await parseJson<{ error?: { message?: string } }>(response).catch(() => null);
    throw new Error(payload?.error?.message ?? "Không thể tạo tài khoản admin.");
  }

  const payload = await parseJson<ApiSuccess<{ id: string }>>(response);
  return payload.data;
}

export async function updateAdminAccount(
  id: string,
  body: {
    fullName?: string;
    email?: string;
    role?: "ADMIN" | "SUPERADMIN";
    password?: string;
  },
): Promise<void> {
  const response = await adminFetch(`/admin/admin-accounts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const payload = await parseJson<{ error?: { message?: string } }>(response).catch(() => null);
    throw new Error(payload?.error?.message ?? "Không thể cập nhật tài khoản admin.");
  }
}

export async function deleteAdminAccount(id: string): Promise<void> {
  const response = await adminFetch(`/admin/admin-accounts/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const payload = await parseJson<{ error?: { message?: string } }>(response).catch(() => null);
    throw new Error(payload?.error?.message ?? "Không thể xoá tài khoản admin.");
  }
}

