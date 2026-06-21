import { Redis } from "ioredis";

import { env } from "../config/env.js";

type RedisClient = Redis;

const globalForCache = globalThis as unknown as {
  redis?: RedisClient;
  redisUnavailableLogged?: boolean;
};

function shouldLogRedisIssue(): boolean {
  if (globalForCache.redisUnavailableLogged) {
    return false;
  }

  globalForCache.redisUnavailableLogged = true;
  return true;
}

function logRedisIssue(context: string, error: unknown): void {
  if (!shouldLogRedisIssue()) {
    return;
  }

  const message = error instanceof Error ? error.message : String(error);
  console.warn(`[Cache] ${context}. Falling back to no-cache mode. ${message}`);
}

function createRedisClient(): RedisClient | null {
  if (!env.USE_REDIS || !env.REDIS_URL) {
    return null;
  }

  const client = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 1,
    enableReadyCheck: true,
    lazyConnect: true,
  });

  client.on("error", (error) => {
    logRedisIssue("Redis is unavailable", error);
  });

  return client;
}

const redisClient = globalForCache.redis ?? createRedisClient();

if (process.env.NODE_ENV !== "production" && redisClient) {
  globalForCache.redis = redisClient;
}

export function buildCacheKey(prefix: string, key: string): string {
  return `${prefix}:${key}`;
}

async function withRedis<T>(
  operation: () => Promise<T>,
  fallback: T,
): Promise<T> {
  if (!redisClient) {
    return fallback;
  }

  try {
    return await operation();
  } catch (error) {
    logRedisIssue("Redis command failed", error);
    return fallback;
  }
}

export const cacheService = {
  isEnabled(): boolean {
    return Boolean(redisClient);
  },

  async ping(): Promise<boolean> {
    if (!redisClient) {
      return !env.USE_REDIS;
    }

    const response = await withRedis(async () => redisClient.ping(), null);
    return response === "PONG";
  },

  async get(key: string): Promise<string | null> {
    return withRedis(async () => redisClient!.get(key), null);
  },

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (!redisClient) {
      return;
    }

    await withRedis(async () => {
      if (ttlSeconds && ttlSeconds > 0) {
        await redisClient.set(key, value, "EX", ttlSeconds);
        return;
      }

      await redisClient.set(key, value);
    }, undefined);
  },

  async exists(key: string): Promise<boolean> {
    const existsCount = await withRedis(
      async () => redisClient!.exists(key),
      0,
    );
    return existsCount > 0;
  },

  async del(...keys: string[]): Promise<number> {
    if (keys.length === 0) {
      return 0;
    }

    return withRedis(async () => redisClient!.del(...keys), 0);
  },
};
