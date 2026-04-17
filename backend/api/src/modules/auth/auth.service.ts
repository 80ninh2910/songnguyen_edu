import type { FastifyInstance } from "fastify";

import { AppError } from "../../common/errors/AppError.js";
import { comparePassword } from "../../common/utils/password.js";
import { env } from "../../config/env.js";
import { prisma } from "../../config/prisma.js";
import { redis } from "../../config/redis.js";
import type { AuthUser, TokenPayload, UserRole } from "./auth.types.js";

type AuthSession = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

function parseDurationToSeconds(duration: string): number {
  const match = duration.match(/^(\d+)([smhd])$/i);

  if (!match) {
    return 7 * 24 * 60 * 60;
  }

  const value = Number(match[1]);
  const unit = match[2].toLowerCase();

  if (unit === "s") return value;
  if (unit === "m") return value * 60;
  if (unit === "h") return value * 60 * 60;
  return value * 24 * 60 * 60;
}

function refreshTokenKey(refreshToken: string): string {
  return `auth:refresh:${refreshToken}`;
}

async function createSession(
  app: FastifyInstance,
  user: AuthUser,
): Promise<AuthSession> {
  const basePayload = {
    sub: user.id,
    role: user.role,
    email: user.email,
  };

  const accessToken = app.jwt.sign(
    {
      ...basePayload,
      typ: "access",
    },
    { expiresIn: env.JWT_ACCESS_EXPIRES },
  );

  const refreshToken = app.jwt.sign(
    {
      ...basePayload,
      typ: "refresh",
    },
    { expiresIn: env.JWT_REFRESH_EXPIRES },
  );

  await redis.set(
    refreshTokenKey(refreshToken),
    JSON.stringify({ userId: user.id, role: user.role }),
    "EX",
    parseDurationToSeconds(env.JWT_REFRESH_EXPIRES),
  );

  return {
    accessToken,
    refreshToken,
    user,
  };
}

export const authService = {
  async loginAdmin(
    app: FastifyInstance,
    email: string,
    password: string,
  ): Promise<AuthSession> {
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      throw new AppError(
        "INVALID_CREDENTIALS",
        401,
        "Invalid email or password",
      );
    }

    const isValidPassword = await comparePassword(password, admin.passwordHash);

    if (!isValidPassword) {
      throw new AppError(
        "INVALID_CREDENTIALS",
        401,
        "Invalid email or password",
      );
    }

    return createSession(app, {
      id: admin.id,
      role: "ADMIN",
      email: admin.email,
      fullName: admin.fullName,
    });
  },

  async loginTutor(
    app: FastifyInstance,
    email: string,
    password: string,
  ): Promise<AuthSession> {
    const tutor = await prisma.tutor.findUnique({
      where: { email },
    });

    if (!tutor || !tutor.passwordHash) {
      throw new AppError(
        "INVALID_CREDENTIALS",
        401,
        "Invalid email or password",
      );
    }

    if (tutor.status !== "APPROVED") {
      throw new AppError(
        "TUTOR_NOT_APPROVED",
        403,
        "Tutor account is not approved yet",
      );
    }

    const isValidPassword = await comparePassword(password, tutor.passwordHash);

    if (!isValidPassword) {
      throw new AppError(
        "INVALID_CREDENTIALS",
        401,
        "Invalid email or password",
      );
    }

    return createSession(app, {
      id: tutor.id,
      role: "TUTOR",
      email: tutor.email,
      fullName: tutor.fullName,
    });
  },

  async refreshAccessToken(
    app: FastifyInstance,
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    let payload: TokenPayload;

    try {
      payload = app.jwt.verify<TokenPayload>(refreshToken);
    } catch {
      throw new AppError("INVALID_REFRESH_TOKEN", 401, "Invalid refresh token");
    }

    if (payload.typ !== "refresh") {
      throw new AppError("INVALID_REFRESH_TOKEN", 401, "Invalid refresh token");
    }

    const exists = await redis.exists(refreshTokenKey(refreshToken));

    if (!exists) {
      throw new AppError(
        "INVALID_REFRESH_TOKEN",
        401,
        "Refresh token was revoked or expired",
      );
    }

    const accessToken = app.jwt.sign(
      {
        sub: payload.sub,
        role: payload.role,
        email: payload.email,
        typ: "access",
      },
      { expiresIn: env.JWT_ACCESS_EXPIRES },
    );

    return { accessToken };
  },

  async revokeRefreshToken(
    refreshToken: string,
  ): Promise<{ revoked: boolean }> {
    const deleted = await redis.del(refreshTokenKey(refreshToken));
    return { revoked: deleted > 0 };
  },

  async getCurrentUser(payload: TokenPayload): Promise<AuthUser | null> {
    if (payload.role === "ADMIN") {
      const admin = await prisma.admin.findUnique({
        where: { id: payload.sub },
      });

      if (!admin) {
        return null;
      }

      return {
        id: admin.id,
        role: "ADMIN",
        email: admin.email,
        fullName: admin.fullName,
      };
    }

    const tutor = await prisma.tutor.findUnique({
      where: { id: payload.sub },
    });

    if (!tutor) {
      return null;
    }

    return {
      id: tutor.id,
      role: "TUTOR",
      email: tutor.email,
      fullName: tutor.fullName,
    };
  },
};
