import Fastify, { type FastifyInstance, type FastifyReply } from "fastify";

import { registerCors } from "./plugins/cors.plugin.js";
import { registerRateLimit } from "./plugins/rateLimit.plugin.js";
import { registerMultipart } from "./plugins/multipart.plugin.js";
import { registerAuth } from "./plugins/auth.plugin.js";
import { registerHelmet } from "./plugins/helmet.plugin.js";
import { registerSwaggerDocs } from "./plugins/swagger.plugin.js";
import { registerScalarDocs } from "./plugins/scalar.plugin.js";
import { registerErrorHandler } from "./common/errors/errorHandler.js";
import { z } from "zod";
import { customErrorMap } from "./common/errors/zodErrorMap.js";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";
import { cacheService } from "./services/cache.service.js";

import { registerAuthRoutes } from "./modules/auth/auth.route.js";
import { registerPublicRoutes } from "./modules/public/public.route.js";
import { registerTutorRoutes } from "./modules/tutor/tutor.route.js";
import { registerAdminRoutes } from "./modules/admin/admin.route.js";
import { registerSettingsRoutes } from "./modules/settings/settings.route.js";

export function buildApp(): FastifyInstance {
  z.setErrorMap(customErrorMap);
  const app = Fastify({
    logger: true,
    trustProxy: env.TRUST_PROXY,
  });

  registerErrorHandler(app);

  const liveHandler = async () => ({
    success: true,
    data: { status: "ok" as const },
  });

  const readyHandler = async (_request: unknown, reply: FastifyReply) => {
    const dependencies = {
      database: false,
      redis: false,
    };

    try {
      await prisma.$queryRawUnsafe("SELECT 1");
      dependencies.database = true;
    } catch (error) {
      app.log.error({ error }, "PostgreSQL readiness check failed");
    }

    dependencies.redis = await cacheService.ping();
    const ready = dependencies.database && dependencies.redis;

    if (!ready) {
      reply.code(503);
    }

    return {
      success: ready,
      data: {
        status: ready ? "ok" : "unavailable",
        dependencies,
      },
    };
  };

  app.get("/health/live", liveHandler);
  app.get("/health/ready", readyHandler);
  app.get("/health", readyHandler);

  void app.register(registerCors);
  void app.register(registerRateLimit);
  void app.register(registerMultipart);
  void app.register(registerAuth);
  void app.register(registerHelmet);

  if (env.ENABLE_API_DOCS) {
    void app.register(registerSwaggerDocs);
    void app.register(registerScalarDocs);
  }

  void app.register(registerAuthRoutes, { prefix: "/api/v1/auth" });
  void app.register(registerPublicRoutes, { prefix: "/api/v1/public" });
  void app.register(registerTutorRoutes, { prefix: "/api/v1/tutor" });
  void app.register(registerAdminRoutes, { prefix: "/api/v1/admin" });
  void app.register(registerSettingsRoutes, { prefix: "/api/v1/admin" });

  return app;
}
