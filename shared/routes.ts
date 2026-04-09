import { z } from 'zod';
import { insertProfileSchema, profiles, dailyLogs } from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  unauthorized: z.object({ message: z.string() }),
};

export const api = {
  contacts: {
    create: {
      method: 'POST' as const,
      path: '/api/contacts' as const,
      input: z.object({
        name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
        email: z.string().email("Please enter a valid email address"),
        subject: z.enum(["General Questions", "Report an Issue", "Other"]).default("General Questions"),
        message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message cannot exceed 2000 characters"),
      }),
      responses: {
        200: z.object({ id: z.number() }),
        400: errorSchemas.validation,
      },
    },
  },
  profiles: {
    get: {
      method: 'GET' as const,
      path: '/api/profile' as const,
      responses: {
        200: z.custom<typeof profiles.$inferSelect>(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    upsert: {
      method: 'POST' as const,
      path: '/api/profile' as const,
      input: insertProfileSchema,
      responses: {
        200: z.custom<typeof profiles.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    upgrade: {
      method: 'POST' as const,
      path: '/api/profile/upgrade' as const,
      responses: {
        200: z.custom<typeof profiles.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    checkout: {
      method: 'POST' as const,
      path: '/api/profile/checkout' as const,
      responses: {
        200: z.object({ sessionId: z.string() }),
        401: errorSchemas.unauthorized,
      },
    },
    checkoutSuccess: {
      method: 'POST' as const,
      path: '/api/profile/checkout-success' as const,
      responses: {
        200: z.custom<typeof profiles.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  logs: {
    getToday: {
      method: 'GET' as const,
      path: '/api/logs/today' as const,
      responses: {
        200: z.custom<typeof dailyLogs.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    increment: {
      method: 'POST' as const,
      path: '/api/logs/today/increment' as const,
      responses: {
        200: z.custom<typeof dailyLogs.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    decrement: {
      method: 'POST' as const,
      path: '/api/logs/today/decrement' as const,
      responses: {
        200: z.custom<typeof dailyLogs.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
