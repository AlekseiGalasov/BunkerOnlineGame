'use client'

import React from 'react';
import Link from "next/link";
import {ROUTES} from "@/constants/route";
import usePageAnimation from "@/components/animations/usePageAnimation";
import {Button} from "@/components/ui/button";

const HomePage = () => {

    const [handleNavigation] = usePageAnimation()

    return (
        <div>
            <Button onClick={() => handleNavigation(ROUTES.CREATE_LOBBY)} className='p-10 text-radiation-yellow'>Lobbies</Button>
            <Link href={ROUTES.CREATE_LOBBY} className='p-10 text-radiation-yellow'>Create lobby</Link>
            <Link href={ROUTES.CREATE_CARD} className='p-10 text-radiation-yellow'>Create Card</Link>
        </div>
    );
};

export default HomePage;