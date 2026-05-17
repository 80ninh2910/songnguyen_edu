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
): error is { code: string; message: string; meta?: { target?: unknown; field_name?: string } } {
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

export function registerErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    // 1. Known application errors
    if (error instanceof AppError) {
      void reply.status(error.statusCode).send({
        success: false,
        error: { code: error.code, message: error.message, details: error.details },
      });
      return;
    }

    // 2. JWT authentication errors → 401
    if (isJwtError(error)) {
      void reply.status(401).send({
        success: false,
        error: { code: ErrorCodes.AUTH_REQUIRED, message: "Authentication required", details: null },
      });
      return;
    }

    // 3. Zod validation errors → 400
    if (error instanceof ZodError) {
      void reply.status(400).send({
        success: false,
        error: {
          code: ErrorCodes.VALIDATION_ERROR,
          message: "Validation failed",
          details: error.issues.map((i) => ({ path: i.path.join("."), code: i.code, message: i.message })),
        },
      });
      return;
    }

    // 4. Fastify JSON schema validation errors → 400
    if (isFastifyValidationError(error)) {
      void reply.status(400).send({
        success: false,
        error: {
          code: ErrorCodes.VALIDATION_ERROR,
          message: "Validation failed",
          details: error.validation.map((i) => ({
            path: i.instancePath ?? "",
            code: i.keyword ?? "validation",
            message: i.message ?? "Invalid request",
            params: i.params ?? null,
          })),
        },
      });
      return;
    }

    // 5. Prisma errors — map to appropriate HTTP status
    if (isPrismaError(error)) {
      const pe = error as { code: string; message: string; meta?: { target?: unknown; field_name?: string } };

      switch (pe.code) {
        // Unique constraint violation → 409
        case "P2002":
          void reply.status(409).send({
            success: false,
            error: { code: "DUPLICATE_ENTRY", message: "Record already exists", details: pe.meta ?? null },
          });
          return;

        // Foreign key constraint fail (e.g. invalid tutorId) → 400
        case "P2003":
          void reply.status(400).send({
            success: false,
            error: { code: "INVALID_REFERENCE", message: "Referenced record not found", details: pe.meta ?? null },
          });
          return;

        // Record not found for update/delete → 404
        case "P2025":
          void reply.status(404).send({
            success: false,
            error: { code: "NOT_FOUND", message: "Record not found", details: pe.meta ?? null },
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

    // 6. Unhandled errors → 500
    void reply.status(500).send({
      success: false,
      error: { code: ErrorCodes.INTERNAL_ERROR, message: "Internal server error", details: null },
    });
  });
}
