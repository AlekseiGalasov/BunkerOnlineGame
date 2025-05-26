'use client'

import React, {useEffect, useState} from 'react';
import {joinToLobby, leaveFromLobby} from "@/lib/actions/lobby.action";
import {Button} from "@/components/ui/button";
import LobbyPasswordForm from "@/components/forms/LobbyPasswordForm";
import {toast} from "sonner";
import Preloader from "@/components/preloader/Preloader";
import LobbyBoard from "@/components/lobby/LobbyBoard";

const LobbyManager = ({lobbyId}: { lobbyId: string }) => {

    const [playerStatus, setPlayerStatus] = useState('waiting');

    useEffect(() => {
        async function connectToLobby() {
            const response = await joinToLobby({id: lobbyId})
            console.log(response)
            if (response.error?.message === 'pass_required') {
                setPlayerStatus('need_pass')
                return
            }
            if (response.error) {
                setPlayerStatus('error')
                toast(`Error`, {
                    description: response.error.message
                })
            }
            if (response.success) {
                setPlayerStatus('joined')
                toast(`Success`, {
                    description: 'Successfully joined'
                })
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
        const result = await joinToLobby({id: lobbyId, password})
        if (result?.success) {
            toast(`Success`, {
                description: 'Successfully joined'
            })
            setPlayerStatus('joined')
        } else {
            toast(`Error ${result.status}`, {
                description: `Error ${result.error?.message}`,
            })
        }
    }

    if (playerStatus === 'waiting') {
        return <Preloader />
    }

    if (playerStatus === 'joined') {
        return (
            <div>
                <Button onClick={handleLeave}>Leave from lobby</Button>
                {playerStatus}
            </div>
        )
    }

    if (playerStatus === 'need_pass') {
        return <LobbyPasswordForm lobbyId={lobbyId} commitPassword={commitPassword}/>
    }

    return <LobbyBoard />
};

export default LobbyManager;