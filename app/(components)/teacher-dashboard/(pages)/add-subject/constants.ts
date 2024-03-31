import { z } from 'zod';

export const FormSchema = z.object({
    grade_level: z.number().min(1, 'Grade is required').transform(Number),
    class_name: z.string().min(1, 'Class is required'),
    subject_id: z.string().min(1, 'Subject is required'),
});
