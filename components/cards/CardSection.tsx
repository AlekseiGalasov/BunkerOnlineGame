import React from 'react';
import {ICard} from "@/models/Card.model";
import ErrorRenderer from "@/components/ErrorRenderer";
import Card from "@/components/cards/Card";

interface CardSectionProps {
    data: { cards: ICard[], isNext: boolean } | undefined
    success: boolean
    error?: {
        message: string
        details?: Record<string, string[]>
        code?: string
    } | undefined
}

const CardSection = ({data, error, success }: CardSectionProps) => {

    const {cards, isNext} = data

    if (error) {
        return <ErrorRenderer error={{message: error?.message}}/>
    }

    if (!cards || cards.length === 0) {
        return <ErrorRenderer
            empty={{message: 'check filters maybe you are type wrong name', title: 'Cards not found'}}/>
    }

    return (
        <section className='px-4 py-2 flex justify-center flex-row gap-4 flex-wrap'>
            { cards.map((card: ICard) => <Card key={card._id} card={card} /> )}
        </section>
    );
};

export default CardSection;