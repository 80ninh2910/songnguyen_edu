import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";

import { AppError } from "./AppError.js";
import { ErrorCodes } from "./errorCodes.js";

type FastifyValidationIssue = {
  instancePath?: string;
  message?: string;
  keyword?: string;
  params?: unknown;
};

type JwtErrorLike = {
  code?: string;
};

function isJwtError(error: unknown): error is JwtErrorLike {
  if (!error || typeof error !== "object" || !("code" in error)) return false;
  const code = (error as JwtErrorLike).code ?? "";
  return (
    code.startsWith("FST_JWT_") ||
    code.startsWith("FAST_JWT_") ||
    code.includes("JWT") ||
    code === "ENOTFOUND"
  );
}

function isPrismaError(
  error: unknown,
): error is {
  code: string;
  message: string;
  meta?: { target?: unknown; field_name?: string };
} {
  return Boolean(
    error &&
    typeof error === "object" &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string" &&
    (error as { code: string }).code.match(/^P\d{4}$/),
  );
}

function isFastifyValidationError(error: unknown): error is {
  validation: FastifyValidationIssue[];
} {
  return Boolean(
    error &&
    typeof error === "object" &&
    "validation" in error &&
    Array.isArray((error as { validation?: unknown }).validation),
  );
}

function getHttpStatusCode(error: unknown): number | null {
  if (!error || typeof error !== "object" || !("statusCode" in error))
    return null;
  const statusCode = (error as { statusCode?: unknown }).statusCode;
  return typeof statusCode === "number" ? statusCode : null;
}

export function registerErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    // 1. Known application errors
    if (error instanceof AppError) {
      void reply.status(error.statusCode).send({
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      });
      return;
    }

    if (isJwtError(error)) {
      void reply.status(401).send({
        success: false,
        error: {
          code: ErrorCodes.AUTH_REQUIRED,
          message: "Yêu cầu xác thực tài khoản",
          details: null,
        },
      });
      return;
    }

    if (error instanceof ZodError) {
      void reply.status(400).send({
        success: false,
        error: {
          code: ErrorCodes.VALIDATION_ERROR,
          message: "Dữ liệu đầu vào không hợp lệ",
          details: error.issues.map((i) => ({
            path: i.path.join("."),
            code: i.code,
            message: i.message,
          })),
        },
      });
      return;
    }

    if (isFastifyValidationError(error)) {
      void reply.status(400).send({
        success: false,
        error: {
          code: ErrorCodes.VALIDATION_ERROR,
          message: "Dữ liệu đầu vào không hợp lệ",
          details: error.validation.map((i) => ({
            path: i.instancePath ?? "",
            code: i.keyword ?? "validation",
            message: i.message ?? "Yêu cầu không hợp lệ",
            params: i.params ?? null,
          })),
        },
      });
      return;
    }

    const statusCode = getHttpStatusCode(error);
    if (statusCode === 429) {
      void reply.status(429).send({
        success: false,
        error: {
          code: ErrorCodes.RATE_LIMITED,
          message: error instanceof Error ? error.message : "Thao tác quá nhanh, vui lòng thử lại sau",
          details: null,
        },
      });
      return;
    }

    // 5. Prisma errors — map to appropriate HTTP status
    if (isPrismaError(error)) {
      const pe = error as {
        code: string;
        message: string;
        meta?: { target?: unknown; field_name?: string };
      };

      switch (pe.code) {
        case "P2002":
          void reply.status(409).send({
            success: false,
            error: {
              code: "DUPLICATE_ENTRY",
              message: "Bản ghi đã tồn tại",
              details: pe.meta ?? null,
            },
          });
          return;

        case "P2003":
          void reply.status(400).send({
            success: false,
            error: {
              code: "INVALID_REFERENCE",
              message: "Không tìm thấy dữ liệu liên kết",
              details: pe.meta ?? null,
            },
          });
          return;

        case "P2025":
          void reply.status(404).send({
            success: false,
            error: {
              code: "NOT_FOUND",
              message: "Không tìm thấy bản ghi",
              details: pe.meta ?? null,
            },
          });
          return;

        default:
          void reply.status(500).send({
            success: false,
            error: {
              code: `PRISMA_${pe.code}`,
              message: pe.message.split("\n")[0],
              details: pe.meta ?? null,
            },
          });
          return;
      }
    }

    void reply.status(500).send({
      success: false,
      error: {
        code: ErrorCodes.INTERNAL_ERROR,
        message:
          error instanceof Error ? error.message : "Lỗi máy chủ nội bộ",
        details: error instanceof Error ? error.stack : null,
      },
    });
  });
}
