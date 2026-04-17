import rateLimit from "@fastify/rate-limit";
import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";

import { env } from "../config/env.js";

export const registerRateLimit = fp(async (app: FastifyInstance) => {
  await app.register(rateLimit, {
    max: env.RATE_LIMIT_MAX_API,
    timeWindow: env.RATE_LIMIT_WINDOW_MS,
  });
});
