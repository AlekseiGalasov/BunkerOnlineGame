'use client'

import React from 'react';
import {ROUTES} from "@/constants/route";
import usePageAnimation from "@/components/animations/usePageAnimation";
import {Button} from "@/components/ui/button";

const HomePage = () => {

    const [handleNavigation] = usePageAnimation()

    return (
        <section className='flex flex-col items-center gap-10 mt-16'>
            <div className='p-10 px-20 backdrop-blur-sm flex flex-col gap-10 w-1/3 justify-center border-2 rounded-sm'>
                <Button onClick={() => handleNavigation(ROUTES.CREATE_CARD)}
                        className='cursor-pointer p-6 '>Create card</Button>
                <Button onClick={() => handleNavigation(ROUTES.CARDS)}
                        className='cursor-pointer p-6 '>Cards</Button>
                <Button onClick={() => handleNavigation(ROUTES.CREATE_LOBBY)}
                        className='cursor-pointer p-6 '>Create lobbies</Button>
                <Button onClick={() => handleNavigation(ROUTES.LOBBIES)}
                        className='cursor-pointer p-6 '>Lobbies</Button>
                <Button onClick={() => handleNavigation(ROUTES.CREATE_SCENARIO)}
                        className='cursor-pointer p-6 '>Create scenario</Button>
                <Button onClick={() => handleNavigation(ROUTES.SCENARIOS)}
                        className='cursor-pointer p-6 '>Scenarios</Button>
                <Button onClick={() => handleNavigation(ROUTES.CREATE_TAG)}
                        className='cursor-pointer p-6 '>Create tag</Button>
                <Button onClick={() => handleNavigation(ROUTES.TAGS)}
                        className='cursor-pointer p-6 '>Tags</Button>
            </div>
        </section>
    );
};

export default HomePage;