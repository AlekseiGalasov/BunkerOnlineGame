import React from 'react';
import SocialAuthForm from "@/components/forms/SocialAuthForm";

const Layout = ({children,}: Readonly<{children: React.ReactNode }>) => {
    return (
        <main className='flex min-h-screen items-center justify-center px-4 py-10'>
            <section className='sm:w-[400px] w-[90%] bg-primary-foreground flex-col gap-4 px-10 py-8 flex justify-center items-center rounded-sm'>
                <div className='flex items-baseline justify-between gap-4'>
                    <h1 className='font-rubik-dirt primary-text-gradient text-2xl'>BunkerPetProject</h1>
                </div>
                {children}
                <SocialAuthForm />
            </section>
        </main>
    );
};

export default Layout;