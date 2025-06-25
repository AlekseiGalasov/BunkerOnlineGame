'use client'

import React, {useState} from 'react';
import {Button} from "@/components/ui/button";
import {addAndRemoveKeysFromQuery, formUrlQuery, removeKeysFromQuery} from "@/lib/url";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {cn} from "@/lib/utils";

type AllowedCardsFilterType = "profession" | "health" | "phobia" | "hobby" | "luggage" | "special" | "bio" | "all";
const AllowedCardsFilter: AllowedCardsFilterType[] = ["all", "profession", "health", "phobia", "hobby", "luggage", "bio"];

const CardsFilter = () => {
    const searchParams = useSearchParams()
    const selectedType = searchParams.get('cardType') || ''
    const router = useRouter()

    const changeFilterHandler = (card: AllowedCardsFilterType) => {
        if (selectedType === '' || selectedType !== card) {
            const newUrl = addAndRemoveKeysFromQuery({
                params: searchParams.toString(),
                value: card,
                key: 'cardType',
                keysToRemove: ['page'],
            })
            router.push(newUrl, {scroll: false})
        } else {
            const newUrl = removeKeysFromQuery({
                params: searchParams.toString(),
                keysToRemove: ['cardType', 'page'],
            })
            router.push(newUrl, {scroll: false})
        }
    }

    return (
        <div className='flex gap-4 px-4 py-2'>
            {AllowedCardsFilter.map(card => (
                <Button className={cn(selectedType === card ? 'bg-radiation-yellow' : '' , 'cursor-pointer')} key={card} onClick={() => changeFilterHandler(card)}>{card}</Button>
            ))}
        </div>
    );
};

export default CardsFilter;