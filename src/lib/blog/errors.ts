export class BlogStoreError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "BlogStoreError";
    this.status = status;
  }
}

export function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Something went wrong.";
}
