export const auditLogService = {
  async log(_params: {
    actorId: string;
    actorName: string;
    action: string;
    targetType: string;
    targetId: string;
    payload?: unknown;
  }): Promise<void> {
    // TODO: write to audit_logs with Prisma
  },
};
