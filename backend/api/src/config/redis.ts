import { Redis } from "ioredis";

import { env } from "./env.js";

type RedisClient = Redis;

const globalForRedis = globalThis as unknown as { redis?: RedisClient };

export const redis =
  globalForRedis.redis ??
  new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 1,
    enableReadyCheck: true,
  });

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}
