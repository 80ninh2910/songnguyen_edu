import type { FastifyInstance, FastifyRequest } from "fastify";

import { AppError } from "../../common/errors/AppError.js";
import {
  errorResponseSchema,
  fromZodSchema,
  successListSchema,
  successSchema,
} from "../../common/utils/docs.js";
import {
  getSettingByKeyHandler,
  listSettingsHandler,
  upsertSettingHandler,
} from "./settings.handler.js";
import {
  SettingKeyParamSchema,
  SettingsListQuerySchema,
  UpsertSettingBodySchema,
} from "./settings.schema.js";

const updatedBySchema = {
  type: "object",
  required: ["id", "fullName", "email"],
  properties: {
    id: { type: "string", format: "uuid" },
    fullName: { type: "string" },
    email: { type: "string", format: "email" },
  },
};

const settingSchema = {
  type: "object",
  required: [
    "id",
    "key",
    "category",
    "value",
    "updatedById",
    "createdAt",
    "updatedAt",
  ],
  properties: {
    id: { type: "string", format: "uuid" },
    key: { type: "string" },
    category: {
      type: "string",
      enum: ["SEO", "PRICING", "LANDING_PAGE", "BANKING", "SYSTEM"],
    },
    value: {},
    description: {
      oneOf: [{ type: "string" }, { type: "null" }],
    },
    updatedById: { type: "string", format: "uuid" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
};

const settingWithUpdaterSchema = {
  ...settingSchema,
  properties: {
    ...settingSchema.properties,
    updatedBy: updatedBySchema,
  },
};

export async function registerSettingsRoutes(
  app: FastifyInstance,
): Promise<void> {
  const requireAdmin = async (request: FastifyRequest): Promise<void> => {
    await request.jwtVerify();

    if (
      !request.user ||
      (request.user.role !== "ADMIN" && request.user.role !== "SUPERADMIN")
    ) {
      throw new AppError("FORBIDDEN", 403, "Không có quyền truy cập");
    }
  };

  app.get(
    "/settings",
    {
      preHandler: requireAdmin,
      schema: {
        tags: ["Settings"],
        summary: "List system settings",
        security: [{ bearerAuth: [] }],
        querystring: fromZodSchema(SettingsListQuerySchema),
        response: {
          200: successListSchema(settingWithUpdaterSchema),
          401: errorResponseSchema,
          403: errorResponseSchema,
        },
      },
    },
    listSettingsHandler,
  );

  app.get(
    "/settings/:key",
    {
      preHandler: requireAdmin,
      schema: {
        tags: ["Settings"],
        summary: "Get setting by key",
        security: [{ bearerAuth: [] }],
        params: fromZodSchema(SettingKeyParamSchema),
        response: {
          200: successSchema(settingWithUpdaterSchema),
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    getSettingByKeyHandler,
  );

  app.put(
    "/settings/:key",
    {
      preHandler: requireAdmin,
      schema: {
        tags: ["Settings"],
        summary: "Create or update setting by key",
        security: [{ bearerAuth: [] }],
        params: fromZodSchema(SettingKeyParamSchema),
        body: fromZodSchema(UpsertSettingBodySchema),
        response: {
          200: successSchema(settingSchema),
          400: errorResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
        },
      },
    },
    upsertSettingHandler,
  );
}
