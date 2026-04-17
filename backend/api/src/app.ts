import Fastify, { type FastifyInstance } from "fastify";

import { registerCors } from "./plugins/cors.plugin.js";
import { registerRateLimit } from "./plugins/rateLimit.plugin.js";
import { registerMultipart } from "./plugins/multipart.plugin.js";
import { registerAuth } from "./plugins/auth.plugin.js";
import { registerScalarDocs } from "./plugins/scalar.plugin.js";
import { registerErrorHandler } from "./common/errors/errorHandler.js";

import { registerAuthRoutes } from "./modules/auth/auth.route.js";
import { registerPublicRoutes } from "./modules/public/public.route.js";
import { registerTutorRoutes } from "./modules/tutor/tutor.route.js";
import { registerAdminRoutes } from "./modules/admin/admin.route.js";

export function buildApp(): FastifyInstance {
  const app = Fastify({ logger: true });

  registerErrorHandler(app);

  app.get("/health", async () => {
    return { success: true, data: { status: "ok" } };
  });

  void app.register(registerCors);
  void app.register(registerRateLimit);
  void app.register(registerMultipart);
  void app.register(registerAuth);
  void app.register(registerScalarDocs);

  void app.register(registerAuthRoutes, { prefix: "/api/v1/auth" });
  void app.register(registerPublicRoutes, { prefix: "/api/v1/public" });
  void app.register(registerTutorRoutes, { prefix: "/api/v1/tutor" });
  void app.register(registerAdminRoutes, { prefix: "/api/v1/admin" });

  return app;
}
