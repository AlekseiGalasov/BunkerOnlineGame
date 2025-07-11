import React, {useState} from 'react';
import {ICharacterCard} from "@/models/Character.model";
import Image from "next/image";
import gasmask from "@/public/images/gasmask.png";
import {green} from "next/dist/lib/picocolors";
import {useGSAP} from "@gsap/react";
import gsap from "gsap";

const cards = [
    {rotate: -45, left: -40, bottom: 70},
    {rotate: -30, left: 0, bottom: 100},
    {rotate: -15, left: 70, bottom: 130},
    {rotate: 0, left: 140, bottom: 140},
    {rotate: 15, left: 210, bottom: 130},
    {rotate: 30, left: 280, bottom: 100}
];

const GameCards = ({card, index}: { card: ICharacterCard, index: number }) => {
    const [isActive, setIsActive] = useState(false)

    const handleAnimation = () => {
        setIsActive(prev => !prev)

        if (isActive) {
            gsap.to(`.card-${index}`, {
                duration: 1,
                ease: "power2.out",
                x: -100,
                y: -100,
                rotateY: 90
            });
            gsap.to(`.card-${index}-flip`, {
                duration: 1,
                ease: "power2.out",
                rotateY: 180,
                delay: 1
            });
        } else {
            gsap.to(`.card-${index}`, {
                duration: 1,
                ease: "power2.out",
                x: 0,
                y: 0,
            });
            gsap.to(`.card-${index}-flip`, {
                duration: 1,
                ease: "power2.out",
                rotateY: 180,
                delay: 1
            });
        }
    }

    return (
        <div
            onClick={handleAnimation}
            className={`card-${index} perspective-distant shadow-lg bg-secondary ${card.isOpen ? 'border-green-300' : 'border-red-300'} border-2 rounded-sm w-[140px] h-[200px] absolute bottom-[${cards[index].bottom}px] rotate-[${cards[index].rotate}deg] left-[${cards[index].left}px]`}>
            <div className='relative w-full h-full transition-[0.8s] transform-3d'>
                <div className={`card-${index}-flip backface-hidden`}>
                    <Image className='absolute opacity-15 top-[15%]' src={gasmask} alt='gas mask icon' width={200}
                           height={200}/>
                </div>
                <div className='backface-hidden flex p-2 h-full justify-between flex-col text-center rotate-y-180'>
                    <span className='font-rubik-dirt primary-text-gradient'>{card.card.name}</span>
                    <span className='font-rubik-dirt primary-text-gradient'><b>Level: </b>{card.card.level} / 5</span>
                    <span className='font-rubik-dirt primary-text-gradient'>{card.card.type}</span>
                    <span className='font-rubik-dirt primary-text-gradient'>{card.isOpen ? 'Open' : 'Closed'}</span>
                </div>
            </div>
        </div>
    );
};

export default GameCards;