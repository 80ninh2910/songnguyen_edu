import cors from "@fastify/cors";
import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";

import { env } from "../config/env.js";

export const registerCors = fp(async (app: FastifyInstance) => {
  await app.register(cors, {
    origin: [env.FRONTEND_URL, env.ADMIN_URL],
    credentials: true,
  });
});
