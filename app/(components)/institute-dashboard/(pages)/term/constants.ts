import { z } from 'zod';

export const FormSchema = z.object({
    term_name: z.string().min(1, 'Term is required'),
    start: z.string().min(1, 'Start date is required'),
    end: z.string().min(1, 'End date is required'),
});

export const year = [
    {
        value: 'all',
        label: 'All',
    },
    {
        value: '2024',
        label: '2024',
    },
    {
        value: '2023',
        label: '2023',
    },
    {
        value: '2022',
        label: '2022',
    },
    {
        value: '2021',
        label: '2021',
    },
    {
        value: '2020',
        label: '2020',
    },
];
