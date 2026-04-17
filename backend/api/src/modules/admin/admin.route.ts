import type { FastifyInstance } from "fastify";

import { success } from "../../common/utils/response.js";

export async function registerAdminRoutes(app: FastifyInstance): Promise<void> {
  app.get("/dashboard", async (_request, reply) => {
    void reply.send(success({ stats: {} }));
  });

  app.get("/tutors", async (_request, reply) => {
    void reply.send(success([]));
  });

  app.get("/tutors/:id", async (request, reply) => {
    void reply.send(success({ id: (request.params as { id: string }).id }));
  });

  app.patch("/tutors/:id/approve", async (_request, reply) => {
    void reply.send(success({ approved: true }));
  });

  app.patch("/tutors/:id/reject", async (_request, reply) => {
    void reply.send(success({ rejected: true }));
  });

  app.get("/class-requests", async (_request, reply) => {
    void reply.send(success([]));
  });

  app.get("/classes", async (_request, reply) => {
    void reply.send(success([]));
  });

  app.post("/classes", async (_request, reply) => {
    void reply.send(success({ created: true }));
  });

  app.post("/classes/:id/assign", async (_request, reply) => {
    void reply.send(success({ assigned: true }));
  });

  app.get("/payments", async (_request, reply) => {
    void reply.send(success([]));
  });

  app.get("/audit-logs", async (_request, reply) => {
    void reply.send(success([]));
  });
}
