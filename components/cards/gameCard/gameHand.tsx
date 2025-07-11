'use client'

import React, {useEffect, useState} from 'react';
import {ICharacterCard, ICharacterDoc} from "@/models/Character.model";
import GameCards from "@/components/cards/gameCard/gameCards";
import {socket} from "@/lib/socket";

const GameHand = () => {

    const [character, setCharacter] = useState<ICharacterDoc | null>(null)

    useEffect(() => {
        socket.on("get_own_character", getCharacterHandler);

        return () => {
            socket.off("get_own_character", getCharacterHandler);
        };

    }, [])

    const getCharacterHandler = ({character}: { character: string }) => {
        console.log(JSON.parse(character))
        setCharacter(JSON.parse(character))
    }

    return (
        <div className='rotate-[8deg] fixed bottom-[-12%] left-[40%]'>
            {
                character?.cards.map((card: ICharacterCard, index) => (
                    <GameCards index={index} key={card.card.type} card={card}/>
                ))
            }
        </div>
    );
};

export default GameHand;