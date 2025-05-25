import React from 'react';
import NavBar from "@/components/navigation/navBar/NavBar";

const Layout = ({children}: { children: React.ReactNode }) => {

    return (
        <>
            <NavBar/>
            <section className="flex min-h-screen flex-1 flex-col p-6 max-md:pb-14 sm:px-14">
                <div className="mx-auto w-full max-w-[1920px]">{children}</div>
            </section>
        </>
    );
};

export default Layout;