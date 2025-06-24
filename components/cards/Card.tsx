import React from 'react';
import {ICard} from "@/models/Card.model";
import Image from "next/image";
import gasmask from "@/public/images/gasmask.png";

interface CardProps {
    card: ICard
}

const Card = ({card}: CardProps) => {

    const {name, description, level} = card

    return (
        <div
            className='border-2 rounded-2xl relative shadow-lg opacity-75 flex flex-col text-center items-center justify-between gap-2 bg-secondary p-4 w-[250px] min-h-[300px]'>
            <Image className='absolute opacity-15 top-[15%] z-[-1]' src={gasmask} alt='gas mask icon' width={200} height={200} />
            <div className='flex flex-col items-center justify-center gap-4'>
                <h2 className='font-rubik-dirt text-xl text-toxic-green'>{name}</h2>
                <p className='primary-text-gradient'>{description}</p>
            </div>
            <div>
                <h3 className='font-rubik-dirt text-xl primary-text-gradient'>Level</h3>
                <p className='font-rubik-dirt text-xl primary-text-gradient'><b>{level}</b> / 5</p>
            </div>
        </div>
    );
};

export default Card;