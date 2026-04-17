import { prisma } from "../config/prisma.js";

type AuditLogInput = {
  actorId: string;
  actorName: string;
  action: string;
  targetType: string;
  targetId: string;
  payload?: unknown;
};

export const auditLogService = {
  async log(params: AuditLogInput, tx?: unknown): Promise<void> {
    const executor = (tx ?? prisma) as any;

    await executor.auditLog.create({
      data: {
        actorId: params.actorId,
        actorName: params.actorName,
        action: params.action,
        targetType: params.targetType,
        targetId: params.targetId,
        payload: params.payload,
      },
    });
  },
};
