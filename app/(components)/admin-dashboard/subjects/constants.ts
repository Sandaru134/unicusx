import { z } from "zod";

export const FormSchema = z.object({
    name: z.string().min(1, 'Subject Name is required'),
    institute_type: z.string().min(1, "select institute type"),
    category: z.string().min(1, "select category"),
});