'use client'

import React, {useState} from 'react';
import ErrorRenderer from "@/components/ErrorRenderer";
import LobbyRow from "@/components/lobby/LobbyRow";
import PaginationComponent from "@/components/navigation/pagination/Pagination";
import {ILobby} from "@/models/Lobby.model";
import {Button} from "@/components/ui/button";

interface TableDataProps {
    lobbies: ILobby[]
    isNext: boolean
    totalPages: number
}

interface LobbyTableProps {
    data: TableDataProps | undefined
    success: boolean
    error?: {
        message: string
        details?: Record<string, string[]>
        code?: string
    } | undefined
}

const LobbyTable = ({error, data, success}: LobbyTableProps) => {

    const [selectedLobby, setSelectedLobby] = useState<string | null>(null);

    const {lobbies, isNext, totalPages} = data as TableDataProps

    if (error) {
        return <ErrorRenderer error={{message: error?.message}}/>
    }

    if (!lobbies || lobbies.length === 0) {
        return <ErrorRenderer
            empty={{message: 'check filters maybe you are type wrong name', title: 'Lobby not found'}}/>
    }

    return (
        <section className='flex w-full flex-col gap-2'>
            <h2 className='font-rubik-dirt text-2xl primary-text-gradient w-full text-center'>Lobbies</h2>
            <div className='flex gap-4 px-6 py-2'>
                <div className='font-rubik-dirt text-xl text-toxic-green w-full'>NAME</div>
                <div className='font-rubik-dirt text-xl text-toxic-green w-1/5'>STATUS</div>
                <div className='font-rubik-dirt text-xl text-toxic-green w-2/5'>SCENARIO</div>
                <div className='font-rubik-dirt text-xl text-toxic-green w-1/5'>PLAYERS</div>
                <div className='font-rubik-dirt text-xl text-toxic-green w-1/5'>PASSWORD</div>
            </div>
            <div className='flex flex-col gap-2 px-6 py-2 min-h-[320px]'>
                {lobbies.length && lobbies.map((lobby: Lobby) => (
                    <LobbyRow setSelectedLobby={setSelectedLobby} selectedLobby={selectedLobby} key={lobby._id}
                              lobby={lobby}/>
                ))}
            </div>
            <div className='flex'>
                <PaginationComponent totalPages={totalPages}/>
                <Button disabled={!selectedLobby} className='w-[160px] h-[48px] cursor-pointer'
                        variant='secondary'>Connect</Button>
            </div>
        </section>
    );
};

export default LobbyTable;