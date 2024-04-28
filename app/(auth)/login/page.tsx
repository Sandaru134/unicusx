import ComponentsAuthLoginForm from '@/components/auth/components-auth-login-form';
import { Metadata } from 'next';
import { K2D } from 'next/font/google';
import Link from 'next/link';
import React from 'react';

const k2d = K2D({
    weight: ['400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-k2d',
  });

export const metadata: Metadata = {
    title: 'Unicus X Login',
};

const CoverLogin = () => {
    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg.png" alt="image" className="h-full w-full object-cover" />
            </div>
            <div className="relative flex min-h-screen items-center justify-center px-6 py-10 dark:bg-[#060818] sm:px-16">
                {/* <img src="/assets/images/auth/coming-soon-object1.png" alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" /> */}
                {/* <img src="/assets/images/auth/coming-soon-object2.png" alt="image" className="absolute left-24 top-0 h-40 md:left-[30%]" /> */}
                {/* <img src="/assets/images/auth/coming-soon-object3.png" alt="image" className="absolute right-0 top-0 h-[300px]" /> */}
                {/* <img src="/assets/images/auth/polygon-object.svg" alt="image" className="absolute bottom-0 end-[28%]" /> */}
                <div className="relative flex w-full max-w-[1502px] flex-col justify-between overflow-hidden rounded-md bg-white backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px] lg:flex-row lg:gap-10 xl:gap-0">
                    <div className="relative hidden w-full items-center justify-center bg-white p-5 lg:inline-flex lg:max-w-[835px] xl:-ms-28 ltr:xl:skew-x-[14deg] rtl:xl:skew-x-[-14deg]">
                        <div className="absolute inset-y-0 w-8 from-primary/10 via-transparent to-transparent xl:w-16 ltr:-right-10 ltr:bg-gradient-to-r ltr:xl:-right-20 rtl:-left-10 rtl:bg-gradient-to-l rtl:xl:-left-20"></div>
                        <div className="ltr:xl:-skew-x-[14deg] rtl:xl:skew-x-[14deg]">
                            <Link href="/" className="ms-10 block w-28 lg:w-72">
                                <img src="/assets/images/auth/unicus-logo.png" alt="Logo" className="w-full" />
                            </Link>
                            <div className="mt-15 hidden w-full max-w-[430px] items-center lg:block">
                                <img src="/assets/images/auth/bg-auth.jpg" alt="Cover Image" className="w-full" />
                            </div>
                        </div>
                    </div>
                    <div className="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]">
                        <div className="flex w-full max-w-[440px] items-center gap-2 lg:absolute lg:end-6 lg:top-6 lg:max-w-full">
                            <div className="w-15 block lg:hidden">
                                <img src="/assets/images/auth/logo.png" alt="Logo" className="mx-auto h-16 w-16" />
                            </div>
                        </div>
                        <div className="w-full max-w-[440px] lg:mt-16">
                            <div className="mb-10">
                                <h1 className={`text-[36px] font-semibold !leading-snug text-gray-500 md:text-4xl font-var(${k2d.variable})`}>Welcome to Unicus X 👋</h1>
                                <h2 className='text-gray-500 font-medium mt-2 pb-2'>Please sign-in to your account and start the adventure</h2>

                                <div className="mt-2 flex h-[80px] flex-col justify-self-start rounded bg-primary-dark-light p-3.5 text-primary dark:bg-primary-dark-light">
                                    <span className="ltr:pr-2 rtl:pl-2 pt-1 font-medium text-[#3278FF]">
                                        Student &nbsp;: Enter US ID / Password: NIC number <br />
                                        <h1 className='pt-1'>Other &nbsp;&nbsp;&nbsp;&nbsp;: Enter US ID and password</h1>
                                    </span>
                                </div>
                            </div>
                            <ComponentsAuthLoginForm />
                        </div>
                        <p className="absolute bottom-6 w-full text-center dark:text-white">© {new Date().getFullYear()}.Unicus-X All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoverLogin;
