'use client'

import React from 'react';
import {Button} from "@/components/ui/button";
import Image from "next/image";
import usePageAnimation from "@/components/animations/usePageAnimation";

interface LinkCardProps {
    card: {
        link: string
        imageName: string
        title: string
        text?: string
    }
}

const LinkCard = ({card}: LinkCardProps) => {

    const [handleNavigation] = usePageAnimation()

    return (
        <Button
            variant="ghost"
            className='cursor-pointer hover:scale-110 backdrop-blur-sm hover:backdrop-blur-none flex flex-col items-center justify-start gap-4 border-2 w-[300px] h-auto'
            onClick={() => handleNavigation(card.link)}
        >
            <Image
                className='w-auto h-auto'
                src={`/images/main_page/${card.imageName}.png`}
                alt={card.title}
                width={200}
                height={200}
            />
            <h3 className='font-rubik-dirt primary-text-gradient text-xl'>{card.title}</h3>
            <p className='text-wrap text-toxic-green'>{card.text}</p>
        </Button>
    );
};

export default LinkCard;