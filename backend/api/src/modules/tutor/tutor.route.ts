import type { FastifyInstance } from "fastify";

import { success } from "../../common/utils/response.js";

export async function registerTutorRoutes(app: FastifyInstance): Promise<void> {
  app.get("/profile", async (_request, reply) => {
    void reply.send(success({}));
  });

  app.patch("/profile", async (_request, reply) => {
    void reply.send(success({ updated: true }));
  });

  app.get("/classes", async (_request, reply) => {
    void reply.send(success([]));
  });

  app.post("/classes/:classId/apply", async (_request, reply) => {
    void reply.send(success({ applied: true }));
  });

  app.delete("/classes/:classId/apply", async (_request, reply) => {
    void reply.send(success({ cancelled: true }));
  });

  app.get("/applications", async (_request, reply) => {
    void reply.send(success([]));
  });

  app.post("/payments", async (_request, reply) => {
    void reply.send(success({ submitted: true }));
  });

  app.get("/payments", async (_request, reply) => {
    void reply.send(success([]));
  });
}
