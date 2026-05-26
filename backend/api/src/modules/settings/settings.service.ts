import { AppError } from "../../common/errors/AppError.js";
import { env } from "../../config/env.js";
import { prisma } from "../../config/prisma.js";
import { buildCacheKey, cacheService } from "../../services/cache.service.js";
import { auditLogService } from "../../services/auditLog.service.js";

type SettingsActor = {
  id: string;
  email: string;
};

const SETTINGS_CACHE_TTL_SECONDS = 3600;

function settingsCacheKey(key: string): string {
  return buildCacheKey(env.SETTINGS_CACHE_PREFIX, key);
}

async function invalidateSettingsCache(keys: string[]): Promise<void> {
  if (keys.length === 0) {
    return;
  }

  await cacheService.del(...keys.map((key) => settingsCacheKey(key)));
}

async function resolveActorName(actor: SettingsActor): Promise<string> {
  const admin = await prisma.admin.findUnique({
    where: { id: actor.id },
    select: { fullName: true },
  });

  return admin?.fullName ?? actor.email;
}

async function triggerRevalidate(paths: string[]): Promise<void> {
  if (!env.NEXTJS_REVALIDATE_URL || !env.NEXTJS_REVALIDATE_SECRET) {
    return;
  }

  try {
    const response = await fetch(env.NEXTJS_REVALIDATE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret: env.NEXTJS_REVALIDATE_SECRET,
        paths,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error("[Settings] Next.js revalidate failed", {
        status: response.status,
        body,
      });
    }
  } catch (error) {
    console.error("[Settings] Next.js revalidate error", error);
  }
}

export const settingsService = {
  async listSettings(query: {
    category?: "SEO" | "PRICING" | "LANDING_PAGE" | "BANKING" | "SYSTEM";
  }) {
    const where: any = {};

    if (query.category) {
      where.category = query.category;
    }

    return prisma.systemSetting.findMany({
      where,
      orderBy: [{ category: "asc" }, { key: "asc" }],
      include: {
        updatedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });
  },

  async getSettingByKey(key: string) {
    const cacheKey = settingsCacheKey(key);
    const cached = await cacheService.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const setting = await prisma.systemSetting.findUnique({
      where: { key },
      include: {
        updatedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!setting) {
      throw new AppError("SETTING_NOT_FOUND", 404, "Không tìm thấy cấu hình");
    }

    await cacheService.set(
      cacheKey,
      JSON.stringify(setting),
      SETTINGS_CACHE_TTL_SECONDS,
    );

    return setting;
  },

  async upsertSetting(
    actor: SettingsActor,
    key: string,
    input: {
      category: "SEO" | "PRICING" | "LANDING_PAGE" | "BANKING" | "SYSTEM";
      value: unknown;
      description?: string;
      revalidatePaths?: string[];
    },
  ) {
    const actorName = await resolveActorName(actor);

    const saved = await prisma.$transaction(async (tx: any) => {
      const setting = await tx.systemSetting.upsert({
        where: { key },
        update: {
          category: input.category,
          value: input.value,
          description: input.description,
          updatedById: actor.id,
        },
        create: {
          key,
          category: input.category,
          value: input.value,
          description: input.description,
          updatedById: actor.id,
        },
      });

      await auditLogService.log(
        {
          actorId: actor.id,
          actorName,
          action: "UPSERT_SETTING",
          targetType: "SETTING",
          targetId: key,
          payload: {
            category: input.category,
            hasRevalidatePaths: (input.revalidatePaths?.length ?? 0) > 0,
          },
        },
        tx,
      );

      return setting;
    });

    await invalidateSettingsCache([key]);
    if (input.revalidatePaths && input.revalidatePaths.length > 0) {
      await triggerRevalidate(input.revalidatePaths);
    }

    return saved;
  },
};
