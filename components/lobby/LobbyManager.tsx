'use client'

import React, {useEffect, useState} from 'react';
import {toast} from "sonner";
import LobbyBoard from "@/components/lobby/LobbyBoard";
import {socket} from "@/lib/socket";
import {useSession} from "next-auth/react";
import {Types} from "mongoose";
import {ILobbyDocWithUsers} from "@/models/Lobby.model";
import {IUserDoc} from "@/models/User.model";

const LobbyManager = ({lobbyId}: { lobbyId: Types.ObjectId }) => {

    const {data: user} = useSession()
    const [lobbydata, setLobbyData] = useState<ILobbyDocWithUsers | null>(null)

    useEffect(() => {
        let isMounted = true;

        const connectSocket = async () => {
            try {
                if (!isMounted) return;

                if (!socket.connected) {
                    await socket.connect();
                }
                socket.emit("lobby_join", {lobbyId: lobbyId.toString(), userId: user?.user?.id});

            } catch (error) {
                console.error('Error connecting to lobby:', error);
                toast('Error', {description: `Could not connect: ${error.message}`});
            }
        };

        const onLobbyData = ({currentLobby, currentUser}: {currentLobby: ILobbyDocWithUsers, currentUser: IUserDoc}) => {
            if (!isMounted) return;
            console.log(currentLobby)
            if (currentUser._id.toString() !== user?.user?.id) {
                toast('Notification', {description: `User ${currentUser.username} connected!`});
            }
            setLobbyData(currentLobby)
        };

        const initializeSocketListeners = () => {
            if (!socket.hasListeners('lobby_data')) {
                console.log('Adding lobby data listener')
                socket.on('lobby_data', onLobbyData);
            }
        };

        const cleanupSocketListeners = () => {
            socket.off('lobby_data', onLobbyData);
        };

        connectSocket()
        initializeSocketListeners();

        return () => {
            isMounted = false;
            cleanupSocketListeners(); // Ensure handlers are removed on unmount
            socket.disconnect(); // Disconnect the socket cleanly
        };
    }, []);

    if (lobbydata === null) {
        return <div>Sasi</div>
    }

    return <LobbyBoard setlobbyData={(data: ILobbyDocWithUsers) => setLobbyData(data)} lobbyData={lobbydata}/>
};

export default LobbyManager;