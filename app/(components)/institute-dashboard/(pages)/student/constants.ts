import { z } from 'zod';

export const FormSchema = z.object({
    full_name: z.string().min(1, 'Name is required').toLowerCase(),
    gender: z.string().min(1, 'Gender date is required'),
    date_of_birth: z.string().min(1, 'Birthday is required'),
    grade: z.number().min(1, 'Grade is required').transform(Number),
    class_name: z.string().min(1, 'Class is required'),
    medium: z.string().min(1, 'Medium is required'),
    nic: z.string().min(1, 'NIC is required'),
    guardian_nic: z.string().min(1, 'Guardian NIC is required'),
    contact_number: z.number().min(10, "Contact number should be 10 digits").transform(Number)
});

export const class_name = ['all','A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
export const grade = ['all','1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];

