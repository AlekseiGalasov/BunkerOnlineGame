'use client'

import React, {useRef} from 'react';
import Image from "next/image";
import gsap from 'gsap';
import {useGSAP} from "@gsap/react";

interface LeftSideBarProps {
    isOpen: boolean; // Sidebar open/closed state, passed as a prop
    onClose: () => void; // Callback for closing the sidebar
}

const LeftSideBar = ({onClose, isOpen }: LeftSideBarProps) => {

    const sidebarRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (isOpen) {
            gsap.to(sidebarRef.current, {
                duration: 1,
                ease: "power2.out",
                x: 0,
            });
        } else {
            gsap.to(sidebarRef.current, {
                duration: 1,
                ease: "bounce.out",
                x: -420,
            });
        }
    }, [isOpen]);

    return (
        <section
            ref={sidebarRef}
            style={{ transform: 'translateX(-420px)' }}
            className='left-side-bar opacity-80 flex w-[420px] fixed left-0 top-0 pt-28 px-2 h-screen bg-primary-foreground flex-col gap-10 border-r-2'
        >
            <div className='flex justify-between items-center w-full px-4 py-4'>
                <h3 className='items-center'>Character Info: </h3>
                <Image
                    src={'/icons/close.svg'}
                    alt={'close'}
                    width={20}
                    height={20}
                    onClick={onClose}
                    className='cursor-pointer'
                />
            </div>
            <div>

            </div>
        </section>
    );
};

export default LeftSideBar;