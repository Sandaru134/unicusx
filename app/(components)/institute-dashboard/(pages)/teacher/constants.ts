import { z } from 'zod';

export const FormSchema = z.object({
    name: z.string().min(1, 'Term is required').toLowerCase(),
    gender: z.string().min(1, 'Start date is required'),
    end: z.string().min(1, 'End date is required'),
});

