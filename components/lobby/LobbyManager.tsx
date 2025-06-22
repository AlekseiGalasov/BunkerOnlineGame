'use client'

import React, {useEffect, useState} from 'react';
import {joinToLobby} from "@/lib/actions/lobby.action";
import LobbyPasswordForm from "@/components/forms/LobbyPasswordForm";
import {toast} from "sonner";
import Preloader from "@/components/preloader/Preloader";
import LobbyBoard from "@/components/lobby/LobbyBoard";
import ErrorRenderer from "@/components/ErrorRenderer";
import {ROUTES} from "@/constants/route";
import {ActionResponse, Lobby} from '@/types/global';
import {socket} from "@/lib/socket";
import {useSession} from "next-auth/react";

const LobbyManager = ({lobbyId}: { lobbyId: string }) => {

    const [lobbyData, setlobbyData] = useState<ActionResponse<Lobby> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const {data: user} = useSession()

    useEffect(() => {
        let isMounted = true; // To prevent updates on unmounted components

        const connectToLobby = async () => {
            try {
                const result = await joinToLobby({ id: lobbyId });

                if (!isMounted) return; // Prevent state updates if unmounted

                if (!socket.connected) {
                    await socket.connect();
                }

                if (result.error) {
                    console.log('Lobby requires password:', result);
                    setlobbyData(result);
                } else if (result.success) {
                    console.log('Successfully joined lobby:', result);
                    setlobbyData(result.data);
                    socket.emit("lobby_join", lobbyId, user?.user?.id);
                } else {
                    toast(`Error ${result.status}`, {
                        description: `Error ${result.error?.message}`,
                    });
                }
            } catch (error) {
                console.error('Error connecting to lobby:', error);
                toast('Error', { description: `Could not connect: ${error.message}` });
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        const onLobbyData = (lobbyData, currentUserData) => {
            if (!isMounted) return;
            console.log('we got new lobby data:', lobbyData)
            const message =
                currentUserData._id === user?.user?.id
                    ? 'Successfully joined the lobby'
                    : `User ${currentUserData.username} joined the lobby`;

            toast('Success', { description: message });
            setlobbyData(lobbyData);
            setIsLoading(false);
        };

        const onUpdateLobby = (lobbyData: Lobby) => {
            if (isMounted) {
                console.log('Lobby updated:', lobbyData, user?.user?.id);
                setlobbyData(lobbyData);
            }
        };

        const initializeSocketListeners = () => {
            if (!socket.hasListeners('lobby_data')) {
                console.log('Adding lobby data listener')
                socket.on('lobby_data', onLobbyData);
            }

            if (!socket.hasListeners('lobby_get_updated')) {
                socket.on('lobby_get_updated', onUpdateLobby);
            }
        };

        const cleanupSocketListeners = () => {
            socket.off('lobby_data', onLobbyData);
            socket.off('lobby_get_updated', onUpdateLobby);
        };

        connectToLobby();
        initializeSocketListeners();

        return () => {
            isMounted = false;
            cleanupSocketListeners(); // Ensure handlers are removed on unmount
            socket.disconnect(); // Disconnect the socket cleanly
        };
    }, [lobbyId]);

    const commitPassword = async (password: string) => {
        setIsLoading(true)
        const result = await joinToLobby({id: lobbyId, password})
        setIsLoading(false)
        if (result?.success) {
            console.log('success data after password:', result)
            setlobbyData(result.data)
            socket.emit("lobby_join", lobbyId, user?.user?.id);
            socket.emit("update_lobby", lobbyId);
        } else {
            toast(`Error ${result.status}`, {
                description: `Error ${result.error?.message}`,
            })
        }
    }

    console.log(isLoading && lobbyData === null)

    if (isLoading && lobbyData === null) return <Preloader/>

    if (lobbyData?.status === 500 && lobbyData.error) {
        return <ErrorRenderer error={{message: lobbyData.error.message, details: lobbyData.error?.details}}
                              button={{text: 'go to the main page', href: ROUTES.HOME}}/>
    }

    switch (lobbyData?.error?.code) {
        case "not_exist":
            return <ErrorRenderer error={{message: 'Lobby not exist ore already closed'}}
                                  button={{text: 'go to the main page', href: ROUTES.HOME}}/>
        case "full_lobby":
            return <ErrorRenderer error={{message: 'Lobby is full'}}
                                  button={{text: 'go to the main page', href: ROUTES.HOME}}/>
        case "required_password":
        case "invalid_password":
            return <LobbyPasswordForm commitPassword={commitPassword}/>
    }

    return <LobbyBoard lobbyData={lobbyData}/>
};

export default LobbyManager;