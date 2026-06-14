import { CorsOptions } from 'cors';

// Define your allowed frontend URLs
const allowedOrigins: string[] = ['http://localhost:5173'];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(
        new Error('Blocked by Cross-Origin Resource Sharing (CORS) policy')
      );
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200,
};
