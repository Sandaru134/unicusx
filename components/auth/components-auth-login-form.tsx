'use client';

import { redirect, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signIn, useSession } from 'next-auth/react';
import toast, { Toaster } from 'react-hot-toast';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const FormSchema = z.object({
    username: z.string().min(1, 'Email is required').toUpperCase(),
    password: z.string().min(5, 'Password is required'),
});

export default function SignInForm() {
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();
    const { data: session, status } = useSession();
    console.log(session);

    const {
        register,
        handleSubmit,
        reset,
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
        if (!signInData?.ok) {
            reset();
            toast.error('Invalid username or password');
        } else {
            toast.success('Login successful');
        }
    };

    useEffect(() => {
        if (status === 'authenticated') {
            if (session?.user.prefix === 'USX') {
                router.push('/admin-dashboard');
            } else if (session?.user.prefix === 'USH') {
                router.push('/institute-dashboard');
            } else if (session?.user.prefix === 'UST') {
                router.push('/teacher-dashboard');
            } else if (session?.user.prefix === 'USS') {
                router.push('/student-dashboard');
            }
        }
    }, [router, session, status]);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            {' '}
            <form className="space-y-5 dark:text-white" onSubmit={handleSubmit(submitForm)}>
                <div>
                    <label htmlFor="Email">User ID</label>
                    <div className="relative text-white-dark border border-1 rounded-md border-[#3278FF]">
                        <input id="Email" {...register('username')} placeholder="Enter User ID" className="form-input placeholder:text-white-dark" />
                    </div>
                    {errors.username && <span className="error text-red-500">{errors.username.message}</span>}
                </div>
                <div>
                    <label htmlFor="Password">Password</label>
                    <div className="relative text-white-dark border border-1 border-[#3278FF] rounded-md">
                        <input id="Password" {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="Enter Password" className="form-input placeholder:text-white-dark" />
                        <button type="button" className="password-toggle absolute right-2 top-1/2 -translate-y-1/2 transform" onClick={handleTogglePassword}>
                            {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                        </button>
                    </div>
                    {errors.password && <span className="error text-red-500">{errors.password.message}</span>}
                </div>
                <button type="submit" className="btn !mt-6 w-full border-0 bg-[#3278FE] text-white shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                    Login
                </button>
            </form>
            <Toaster />
        </div>
    );
}
