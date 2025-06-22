'use client'

import React, {useRef, useState} from 'react';
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";
import {ROUTES} from "@/constants/route";
import {useRouter} from "next/navigation";

const SCENARIO_MAPPER = {
    zombie: '🧟 Zombie virus',
    rise_ai: '🤖 Rise of the AI',
    atomic_winter: '☢️ Atomic winter',
}

interface LobbyRowParams {
    lobby: Lobby
}

const LobbyRow = ({lobby}: LobbyRowParams) => {

    const [clickCount, setClickCount] = useState(1);
    const [selectedLobby, setSelectedLobby] = useState<string | null>(null);
    const timer = useRef<NodeJS.Timeout>()
    const router = useRouter()

    const handeClickToLobby = (lobby: Lobby) => {
        if (selectedLobby === lobby._id) {
            return setSelectedLobby(null)
        } else {
            setSelectedLobby(null)
        }

        setClickCount(clickCount + 1)

        if (clickCount === 1) {
            timer.current = setTimeout(() => {
                setClickCount(1);
                setSelectedLobby(lobby._id);
            }, 300);
        } else if (clickCount === 2) {
            clearTimeout(timer.current);
            setClickCount(1);
            router.push(ROUTES.LOBBY(lobby._id))
        }
    }

    return (
        <Button
            onClick={() => handeClickToLobby(lobby)}
            className={cn(selectedLobby === lobby._id ? 'bg-sidebar text-toxic-green border-sidebar hover:bg-sidebar' : 'bg-primary border-radiation-yellow','cursor-pointer flex gap-4 hover:border-toxic-green rounded-sm border-2 p-6 ')}
            key={lobby._id} asChild>
            <div>
                <div className='w-full'>{lobby.name}</div>
                <div className='w-1/5'>{lobby.status}</div>
                <div className='w-2/5'>{SCENARIO_MAPPER[lobby.scenario]}</div>
                <div className='w-1/5'><Badge variant='secondary' >{lobby.countPlayers} / {lobby.maxPlayer}</Badge></div>
                <div className='w-1/5'><Badge variant='secondary' >{lobby.isProtected ? 'Yes' : 'No'}</Badge></div>
            </div>
        </Button>
    );
};

export default LobbyRow;