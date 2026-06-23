import helmet from "@fastify/helmet";
import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";

export const registerHelmet = fp(async (app: FastifyInstance) => {
  await app.register(helmet, {
    // This service is a JSON API. CSP is managed by the Next.js frontends.
    contentSecurityPolicy: false,
  });
});
