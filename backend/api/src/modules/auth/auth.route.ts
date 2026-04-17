import type { FastifyInstance, FastifyRequest } from "fastify";

import {
  loginAdminHandler,
  loginTutorHandler,
  logoutHandler,
  meHandler,
  refreshHandler,
} from "./auth.handler.js";

export async function registerAuthRoutes(app: FastifyInstance): Promise<void> {
  const requireAuth = async (request: FastifyRequest): Promise<void> => {
    await request.jwtVerify();
  };

  app.post("/admin/login", loginAdminHandler);
  app.post("/tutor/login", loginTutorHandler);
  app.post("/refresh", refreshHandler);
  app.post("/logout", { preHandler: requireAuth }, logoutHandler);
  app.get("/me", { preHandler: requireAuth }, meHandler);
}
