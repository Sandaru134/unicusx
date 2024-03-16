'use client';

import { redirect, useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signIn } from 'next-auth/react';

const FormSchema = z.object({
    username: z.string().min(1, 'Email is required'),
    password: z.string().min(5, 'Password is required'),
});

export default function SignInForm() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const submitForm = async (data: z.infer<typeof FormSchema>) => {
        const signInData = await signIn('credentials', {
            username: data.username,
            password: data.password,
            redirect: false,
        });
        if (signInData?.error) {
            alert(signInData.error);
        } else {
            router.push('/admin-dashboard');
        }
    };

    return (
        <form className="space-y-5 dark:text-white" onSubmit={handleSubmit(submitForm)}>
            <div>
                <label htmlFor="Email">Email</label>
                <div className="relative text-white-dark">
                    <input
                        id="Email"
                        {...register('username')} // Use register for form field binding
                        placeholder="Enter Email"
                        className="form-input placeholder:text-white-dark"
                    />
                    {errors.username && <span className="error text-red-500">{errors.username.message}</span>}
                </div>
            </div>
            <div>
                <label htmlFor="Password">Password</label>
                <div className="relative text-white-dark">
                    <input
                        id="Password"
                        type="password"
                        {...register('password')} // Use register for form field binding
                        placeholder="Enter Password"
                        className="form-input placeholder:text-white-dark"
                    />
                    {errors.password && <span className="error text-red-500">{errors.password.message}</span>}
                </div>
            </div>
            <button type="submit" className="btn !mt-6 w-full border-0 bg-[#3278FE] uppercase text-white shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                Sign in
            </button>
        </form>
    );
}
