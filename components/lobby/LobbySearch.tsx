'use client'

import React from 'react';
import {SearchParams} from "@/app/(root)/lobby/page";
import {Button} from "@/components/ui/button";
import LocalSearch from "@/components/search/LocalSeaarch";

const LobbySearch = ({searchParams}: SearchParams) => {

    return (
        <div className='h-full flex flex-col items-center gap-4'>
            <h2 className='font-rubik-dirt text-2xl primary-text-gradient'>Filetrs and Searching</h2>
            <div className='flex flex-col gap-4 w-full flex-1'>
                <LocalSearch
                    placeholder={'Search'}
                    route={'/lobby'}
                />
            </div>
            <div className='flex gap-4 w-full justify-between'>
                <Button className='w-[160px] h-[48px] cursor-pointer' variant='secondary'>Refresh</Button>
                <Button className='w-[160px] h-[48px] cursor-pointer' disabled={true} variant='outline'>Connect</Button>
            </div>
        </div>
    );
};

export default LobbySearch;