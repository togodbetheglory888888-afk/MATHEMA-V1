import { z } from 'zod';
import { checkAnswerSchema, checkAnswerResponseSchema, questions } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  questions: {
    next: {
      method: 'GET' as const,
      path: '/api/questions/next',
      responses: {
        200: z.object({
          id: z.number(),
          questionText: z.string(),
        }),
      },
    },
    check: {
      method: 'POST' as const,
      path: '/api/questions/check',
      input: checkAnswerSchema,
      responses: {
        200: checkAnswerResponseSchema,
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
  },
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

export type CheckAnswerRequest = z.infer<typeof checkAnswerSchema>;
export type CheckAnswerResponse = z.infer<typeof checkAnswerResponseSchema>;
