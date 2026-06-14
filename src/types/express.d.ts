declare global {
  namespace Express {
    export interface Request {
      validated: {
        params?: unknown;
        body?: unknown;
        query?: unknown;
      };
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

export {};
