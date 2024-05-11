import { z } from "zod";

export const FormSchema = z.object({
    name: z.string().min(1, 'Subject name is required'),
    institute_type: z.string().min(1, "Institute type is required"),
    category: z.string().min(1, "Category is required"),
});