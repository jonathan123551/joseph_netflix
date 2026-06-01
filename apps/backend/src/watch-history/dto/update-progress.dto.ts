import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const updateProgressSchema = z.object({
  movieId: z.string().min(1),
  progressSecs: z.number().int().min(0),
});

export class UpdateProgressDto extends createZodDto(updateProgressSchema) {}
