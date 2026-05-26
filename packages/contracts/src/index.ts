export type ApiEnvelope<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ClassType = "LOP_GIA_SU_TU_DO" | "LOP_GIA_SU_DAO_TAO" | "LOP_TRUNG_TAM";

export type TutorType =
  | "GIA_SU_TU_DO"
  | "GIA_SU_DAO_TAO"
  | "GIAO_VIEN_TRUNG_TAM"
  | "ANY";

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";

export type SessionStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";

export type ClassMemberInput = {
  studentName: string;
  studentGrade?: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  address?: string;
};

export type CreateClassPayload = {
  title: string;
  subject: string;
  grade: string;
  district: string;
  feePerHour: number;
  schedule?: string;
  sourceRequestId?: string;
  classType?: ClassType;
  tutorType?: TutorType;
  centerTeacherId?: string;
  members?: ClassMemberInput[];
};

export type CreateClassSessionPayload = {
  sessionDate: string;
  startTime?: string;
  endTime?: string;
  topic?: string;
  notes?: string;
};

export type SessionFeedbackInput = {
  memberId: string;
  attendance?: AttendanceStatus;
  attitudeScore?: number;
  comprehensionScore?: number;
  homeworkScore?: number;
  strengths?: string;
  weaknesses?: string;
  recommendation?: string;
  overallComment?: string;
};

export type SubmitSessionFeedbacksPayload = {
  feedbacks: SessionFeedbackInput[];
};
