export class SupabaseError extends Error {
  constructor(message: string, public readonly originalError?: any) {
    super(message);
  }
}