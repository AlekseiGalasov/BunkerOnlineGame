'use client'

import React, {useEffect} from 'react';
import gsap from "gsap";
import {usePathname} from "next/navigation";

const PageAnimation = ({children}: { children: React.ReactNode }) => {
    const pathname = usePathname()
    const timeline = gsap.timeline();

    useEffect(() => {

        const handleRouteChangeStart = () => {
            timeline.fromTo('.leftSide', {width: '50%'}, {width: 0, duration: 1.5}, 0.5)
            timeline.fromTo('.rightSide', {width: '50%'}, {width: 0, duration: 1.5}, 0.5)
        };

        handleRouteChangeStart()

        return () => {
            timeline.kill();
        };

    }, [pathname, timeline])

    return (
        <>
            <div className='bg-[url("/images/texture_animation.jpg")] bg-left bg-cover bg-no-repeat overflow-hidden bg-blend-darken z-30 leftSide h-[calc(100%-68px)] bg-stone-800 w-[50%] absolute top-[68px] left-0'>
                <div className='bg-[url("/images/hazard_line.jpg")] bg-right-bottom w-[20px] absolute right-0 h-full bg-repeat' ></div>
            </div>
                {children}
            <div className='bg-[url("/images/texture_animation.jpg")] bg-left bg-cover bg-no-repeat overflow-hidden rotate-180 bg-blend-darken z-30 rightSide h-[calc(100%-68px)] bg-stone-800 w-[50%] absolute top-[68px] right-0'>
                <div className='bg-[url("/images/hazard_line.jpg")] bg-right-bottom w-[20px] absolute right-0 h-full bg-repeat' ></div>
            </div>
        </>
    );
};

export default PageAnimation;