import React from 'react';
import NavBar from "@/components/navigation/navBar/NavBar";
import BreadCumbers from "@/components/navigation/breadCumbers/BreadCumbers";

const Layout = ({children}: { children: React.ReactNode }) => {

    return (
        <main>
            <NavBar/>
            <section
                className='bg-[url("/images/lobby_bg.png")] overflow-y-scroll bg-cover bg-top bg-no-repeat w-full h-[100vh] flex flex-col pt-24 max-md:pb-14 sm:px-14 pb-6'>
                <div className=' mx-auto w-full max-w-[1920px]'>
                    <BreadCumbers />
                    {children}
                </div>
            </section>
        </main>
    );
};

export default Layout;