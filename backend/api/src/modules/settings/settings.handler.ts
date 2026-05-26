import type { FastifyReply, FastifyRequest } from "fastify";

import { AppError } from "../../common/errors/AppError.js";
import { success, successList } from "../../common/utils/response.js";
import {
  SettingCategorySchema,
  SettingKeyParamSchema,
  SettingsListQuerySchema,
  UpsertSettingBodySchema,
} from "./settings.schema.js";
import { settingsService } from "./settings.service.js";

function getActor(request: FastifyRequest): {
  id: string;
  email: string;
  role: "ADMIN" | "SUPERADMIN";
} {
  if (!request.user) {
    throw new Error("Authenticated user is required");
  }

  if (request.user.role !== "ADMIN" && request.user.role !== "SUPERADMIN") {
    throw new AppError("FORBIDDEN", 403, "Không có quyền truy cập");
  }

  return {
    id: request.user.sub,
    email: request.user.email,
    role: request.user.role,
  };
}

function isSensitiveSetting(
  key: string,
  category: "SEO" | "PRICING" | "LANDING_PAGE" | "BANKING" | "SYSTEM",
): boolean {
  if (category === "BANKING") {
    return true;
  }

  return (
    key.startsWith("bank.") ||
    key.startsWith("admin.") ||
    key.startsWith("security.")
  );
}

export async function listSettingsHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const query = SettingsListQuerySchema.parse(request.query);
  const result = await settingsService.listSettings(query);
  void reply.send(
    successList(result, {
      page: 1,
      limit: result.length,
      total: result.length,
      totalPages: 1,
    }),
  );
}

export async function getSettingByKeyHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { key } = SettingKeyParamSchema.parse(request.params);
  const result = await settingsService.getSettingByKey(key);
  void reply.send(success(result));
}

export async function upsertSettingHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const actor = getActor(request);
  const { key } = SettingKeyParamSchema.parse(request.params);
  const body = UpsertSettingBodySchema.parse(request.body);

  if (isSensitiveSetting(key, body.category) && actor.role !== "SUPERADMIN") {
    throw new AppError(
      "FORBIDDEN",
      403,
      "Yêu cầu quyền Superadmin để thực hiện thiết lập này",
    );
  }

  const result = await settingsService.upsertSetting(actor, key, {
    category: body.category,
    value: body.value,
    description: body.description,
    revalidatePaths: body.revalidatePaths,
  });
  void reply.send(success(result));
}
