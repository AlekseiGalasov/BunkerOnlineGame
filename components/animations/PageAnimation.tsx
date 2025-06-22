'use client'

import React, {useEffect} from 'react';
import gsap from "gsap";
import {usePathname} from "next/navigation";
import Valve from '@/public/images/valve.svg';
import Image from "next/image";

const PageAnimation = ({children}: { children: React.ReactNode }) => {
    const pathname = usePathname()
    const timeline = gsap.timeline();

    useEffect(() => {

        const handleRouteChangeStart = () => {
            timeline.to('.valve', {scale: 1.2, delay: 1, duration: 1})
            timeline.to('.valve', {rotation: 180, repeat: 1, duration: 1})
            timeline.to('.valve', {scale: 1, duration: 1})
            timeline.fromTo('.leftSide', {x: 0}, {x: '-100%', duration: 2}, "4")
            timeline.fromTo('.rightSide', {width: '50%'}, {width: 0, duration: 2}, "4")
        };

        handleRouteChangeStart()

    }, [pathname])

    return (
        <>
            <div className='leftSide h-[calc(100%-68px)] bg-stone-800 w-[50%] absolute top-[68px] left-0'>
                <Image className='valve absolute right-5 top-[30%]' src={Valve} alt='valve' width={200} height={200}/>
            </div>
                {children}
            <div className='rightSide h-[calc(100%-68px)]  bg-stone-800 w-[50%] absolute top-[68px] right-0'>
            </div>
        </>
    );
};

export default PageAnimation;