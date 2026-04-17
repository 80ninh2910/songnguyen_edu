export const uploadService = {
  async uploadDocument(
    _buffer: Buffer,
    _fileName: string,
  ): Promise<{ url: string }> {
    // TODO: integrate Cloudinary
    return { url: "https://example.com/file" };
  },
};
