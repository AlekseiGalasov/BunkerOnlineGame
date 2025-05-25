'use client'

import React, {useEffect, useState} from 'react';
import {joinToLobby, leaveFromLobby} from "@/lib/actions/lobby.action";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import { Form } from 'react-hook-form';
import LobbyPasswordForm from "@/components/forms/LobbyPasswordForm";
import {toast} from "sonner";
import {ROUTES} from "@/constants/route";

const LobbyManager = ({lobbyId}: {lobbyId: string}) => {

    const [playerStatus, setPlayerStatus] = useState('waiting');

    useEffect(() => {
        async function connectToLobby() {
            const response = await joinToLobby({password: '', id: lobbyId})
            console.log(response)
            if (response.error?.message === 'pass_required') {
                setPlayerStatus('need_pass')
            }
            if (response.success) {
                setPlayerStatus('joined')
            }
        }

        connectToLobby()

        return async () => {
            await leaveFromLobby({id: lobbyId})
        }

    }, [])

    const handleLeave = async () => {
        await leaveFromLobby({id: lobbyId})
    }

    const commitPassword = async (password: string) => {
        const result = await joinToLobby({id: lobbyId, password })
        console.log(result)

        if (result?.success) {
            toast(`Success`, {
                description: 'Signed in successfully'
            })
            setPlayerStatus('joined')
        } else {
            toast(`Error ${result.status}`,{
                description: `Error ${result.error?.message}`,
            })
        }
    }

    if (playerStatus === 'need_pass') {
        return <LobbyPasswordForm lobbyId={lobbyId} commitPassword={commitPassword} />
    }

    if (playerStatus === 'joined') {
        return (
            <div>
                <Button onClick={handleLeave}>Leave from lobby</Button>
                {playerStatus}
            </div>
        )
    }

    return (
        <div>
            <Button onClick={handleLeave}>Leave from lobby</Button>
            {playerStatus}
        </div>
    );
};

export default LobbyManager;