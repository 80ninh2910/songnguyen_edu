import type { FastifyInstance } from "fastify";

import { success } from "../../common/utils/response.js";

export async function registerPublicRoutes(app: FastifyInstance): Promise<void> {
  app.get("/classes", async (_request, reply) => {
    void reply.send(success([]));
  });

  app.get("/classes/:id", async (request, reply) => {
    void reply.send(success({ id: (request.params as { id: string }).id }));
  });

  app.get("/tutors", async (_request, reply) => {
    void reply.send(success([]));
  });

  app.post("/class-requests", async (_request, reply) => {
    void reply.send(success({ created: true }));
  });

  app.post("/tutors/register", async (_request, reply) => {
    void reply.send(success({ tutorId: "pending-tutor-id", uploadToken: "upload-token" }));
  });

  app.post("/tutors/:id/documents", async (_request, reply) => {
    void reply.send(success({ uploaded: true }));
  });
}
