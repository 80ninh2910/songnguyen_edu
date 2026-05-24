import type { FastifyInstance, FastifyRequest } from "fastify";

import {
  loginAdminHandler,
  loginTutorHandler,
  logoutHandler,
  meHandler,
  refreshHandler,
} from "./auth.handler.js";
import {
  AdminLoginSchema,
  LogoutSchema,
  RefreshSchema,
  TutorLoginSchema,
} from "./auth.schema.js";
import {
  errorResponseSchema,
  fromZodSchema,
  successSchema,
} from "../../common/utils/docs.js";
import { env } from "../../config/env.js";

const authUserSchema = {
  type: "object",
  required: ["id", "role", "email", "fullName"],
  properties: {
    id: { type: "string" },
    role: { type: "string", enum: ["ADMIN", "SUPERADMIN", "TUTOR"] },
    email: { type: "string", format: "email" },
    fullName: { type: "string" },
  },
};

const authSessionSchema = {
  type: "object",
  required: ["accessToken", "refreshToken", "user"],
  properties: {
    accessToken: { type: "string" },
    refreshToken: { type: "string" },
    user: authUserSchema,
  },
};

export async function registerAuthRoutes(app: FastifyInstance): Promise<void> {
  const requireAuth = async (request: FastifyRequest): Promise<void> => {
    await request.jwtVerify();
  };

  app.post(
    "/admin/login",
    {
      config: {
        rateLimit: {
          max: env.RATE_LIMIT_MAX_LOGIN,
          timeWindow: env.RATE_LIMIT_WINDOW_MS,
        },
      },
      schema: {
        tags: ["Auth"],
        summary: "Admin login",
        body: fromZodSchema(AdminLoginSchema),
        response: {
          200: successSchema(authSessionSchema),
          400: errorResponseSchema,
          401: errorResponseSchema,
        },
      },
    },
    loginAdminHandler,
  );

  app.post(
    "/tutor/login",
    {
      config: {
        rateLimit: {
          max: env.RATE_LIMIT_MAX_LOGIN,
          timeWindow: env.RATE_LIMIT_WINDOW_MS,
        },
      },
      schema: {
        tags: ["Auth"],
        summary: "Tutor login",
        body: fromZodSchema(TutorLoginSchema),
        response: {
          200: successSchema(authSessionSchema),
          400: errorResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
        },
      },
    },
    loginTutorHandler,
  );

  app.post(
    "/refresh",
    {
      schema: {
        tags: ["Auth"],
        summary: "Refresh access token",
        body: fromZodSchema(RefreshSchema),
        response: {
          200: successSchema({
            type: "object",
            required: ["accessToken"],
            properties: {
              accessToken: { type: "string" },
            },
          }),
          400: errorResponseSchema,
          401: errorResponseSchema,
        },
      },
    },
    refreshHandler,
  );

  app.post(
    "/logout",
    {
      preHandler: requireAuth,
      schema: {
        tags: ["Auth"],
        summary: "Logout and revoke refresh token",
        security: [{ bearerAuth: [] }],
        body: fromZodSchema(LogoutSchema),
        response: {
          200: successSchema({
            type: "object",
            required: ["revoked"],
            properties: {
              revoked: { type: "boolean" },
            },
          }),
          400: errorResponseSchema,
          401: errorResponseSchema,
        },
      },
    },
    logoutHandler,
  );

  app.get(
    "/me",
    {
      preHandler: requireAuth,
      schema: {
        tags: ["Auth"],
        summary: "Get current authenticated user",
        security: [{ bearerAuth: [] }],
        response: {
          200: successSchema({
            type: "object",
            required: ["user"],
            properties: {
              user: {
                oneOf: [authUserSchema, { type: "null" }],
              },
            },
          }),
          401: errorResponseSchema,
        },
      },
    },
    meHandler,
  );
}
