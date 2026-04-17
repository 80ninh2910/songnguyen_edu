export const emailService = {
  async sendTutorApproved(
    _to: string,
    _fullName: string,
    _tempPassword: string,
  ): Promise<void> {
    // TODO: integrate Resend
  },

  async sendTutorRejected(
    _to: string,
    _fullName: string,
    _reason: string,
  ): Promise<void> {
    // TODO: integrate Resend
  },
};
