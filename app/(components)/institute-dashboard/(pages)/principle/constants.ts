import { z } from "zod";

export const FormSchema = z.object({
    full_name: z.string().min(1, 'Name is required'),
    gender: z.string().min(1, 'Gender date is required'),
    type: z.string().min(1, 'Type is required'),
    grade: z.string().min(1, 'Grade is required'),
    nic: z.string().min(1, 'NIC is required'),
    contact_number: z.number().min(10, "Contact number should be 10 digits").transform(Number),
});