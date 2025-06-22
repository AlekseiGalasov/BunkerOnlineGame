'use client'

import React, {useEffect, useMemo, useRef, useState} from 'react';
import {leaveFromLobby} from "@/lib/actions/lobby.action";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {Lobby} from "@/types/global";
import {redirect} from "next/navigation";
import {ROUTES} from "@/constants/route";
import {useSession} from "next-auth/react";
import {socket} from "@/lib/socket";
import LeftSideBar from "@/components/lobby/LeftSideBar";
import gsap from "gsap";
import {useGSAP} from "@gsap/react";
import lobbyBg from '../../public/images/lobby_bg.png';

gsap.registerPlugin(useGSAP)

interface LobbyBoardParams {
    lobbyData: Lobby
}

const LobbyBoard = ({lobbyData}: LobbyBoardParams) => {

    const {data: session} = useSession();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    useEffect(() => {
        socket.on("leave_from_lobby", disconnectHandler);
    }, [])

    const disconnectHandler = (user: User) => {
        const text = user._id === session?.user?.id ? 'Successfully leaved' : `User ${user.username} leaved`
        toast(`Success`, {
            description: text
        })
    }

    const handleLeave = async () => {
        const result = await leaveFromLobby({id: lobbyData._id})

        if (result?.success) {
            socket.emit("lobby_leave", lobbyData._id, session?.user?.id);
            socket.emit("lobby_update", lobbyData._id, session?.user?.id);
            redirect(ROUTES.HOME)
        } else {
            toast(`Error ${result.status}`, {
                description: `Error ${result.error?.message}`,
            })
        }
    }

    //const isCreator = lobbyData.creator === session?.user?.id ? 'Creator' : "Guest"

    const emptyPlayerPlaces = useMemo(() => {
        return new Array(16 - lobbyData.players.length).fill('empty');
    }, [lobbyData])

    return (
        <div className='flex flex-col gap-4 justify-center items-center'>
            <h2 className='text-4xl primary-text-gradient font-rubik-dirt'>Players</h2>
            <div
                className='border-2 border-accent px-4 py-6 rounded-sm w-full justify-center h-full flex gap-4 flex-wrap'>
                {lobbyData.players.map((player: User) => (
                    <div
                        className='w-1/6 border-accent border-2 rounded-2xl p-4 h-[120px] flex justify-center items-center'
                        key={player._id}
                        onClick={toggleSidebar}
                    >
                        {player.username}
                    </div>
                ))}
                {emptyPlayerPlaces.map((player, index) => (
                    <div
                        className='w-1/6 border-accent border-2 rounded-2xl p-4 h-[120px] flex justify-center items-center'
                        key={index}
                    >
                        Empty
                    </div>
                ))}
                <LeftSideBar
                   isOpen={isSidebarOpen}
                   onClose={toggleSidebar}
                />
            </div>
            <div
                className='flex justify-center items-center w-1/5 fixed bottom-0 border-x-2 border-t-2 p-4 pb-8 rounded-t-2xl'>
                <Button onClick={handleLeave}>Leave</Button>
            </div>
        </div>
    );
};

export default LobbyBoard;