'use client'

import React, {useEffect, useMemo} from 'react';
import {leaveFromLobby} from "@/lib/actions/lobby.action";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {redirect} from "next/navigation";
import {ROUTES} from "@/constants/route";
import {useSession} from "next-auth/react";
import {socket} from "@/lib/socket";
import LeftSideBar from "@/components/lobby/LeftSideBar";
import gsap from "gsap";
import {useGSAP} from "@gsap/react";
import {ILobbyDocWithUsers} from "@/models/Lobby.model";
import {Types} from "mongoose";
import {createGame} from "@/lib/actions/game.action";
import {ICharacterDoc} from "@/models/Character.model";
import {IGameDoc} from "@/models/Game.model";
import GameHand from "@/components/cards/gameCard/gameHand";

gsap.registerPlugin(useGSAP)

interface LobbyBoardParams {
    lobbyData: ILobbyDocWithUsers
    setlobbyData: (data: ILobbyDocWithUsers) => void;
}

const LobbyBoard = ({lobbyData, setlobbyData}: LobbyBoardParams) => {

    const {data: session} = useSession();

    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const [isGameStarted, setIsGameStarted] = React.useState(false);

    const toggleSidebar = (id: string) => {
        setIsSidebarOpen((prev) => !prev)
    };

    useEffect(() => {

        if (lobbyData.status === 'active') {
            socket.emit("send_character", {lobbyId: lobbyData._id.toString(), userId: session?.user?.id});
        }

        socket.on("leave_from_lobby", disconnectHandler);
        socket.on("game_started", getStartedHandler);

        return () => {
            socket.off("leave_from_lobby", disconnectHandler);
            socket.off("game_started", getStartedHandler);
        }
    }, [])

    const disconnectHandler = ({lobby, userId}: { lobby: ILobbyDocWithUsers, userId: string }) => {
        toast(`Notification`, {
            description: `User with Id: ${userId.toString()} leaved from lobby`,
        })
        console.log('update lobby data', lobby)
        setlobbyData(lobby)
    }

    const getStartedHandler = ({gameData}: { gameData: string }) => {
        const game: IGameDoc = JSON.parse(gameData)

        toast(`Notification`, {
            description: `Game with Id: ${game._id.toString()} started`,
        })
        console.log('here')
        socket.emit("send_character", {lobbyId: lobbyData._id.toString(), userId: session?.user?.id});
    }


    const handleLeave = async () => {
        const result = await leaveFromLobby({id: lobbyData._id})

        if (result?.success) {
            socket.emit("lobby_leave", {lobbyId: lobbyData._id, userId: session?.user?.id});
            redirect(ROUTES.HOME)
        } else {
            toast(`Error ${result.status}`, {
                description: `Error ${result.error?.message}`,
            })
        }
    }

    const createGameHandler = async () => {
        const result = await createGame({lobbyId: lobbyData._id})
        if (result.success && result.data) {
            setIsGameStarted(true)
            socket.emit("game_start", { gameId: result.data.id, lobbyId: lobbyData._id.toString() });
        }
    }

    const isCreator = lobbyData.creator === session?.user?.id

    const emptyPlayerPlaces = useMemo(() => {
        return new Array(16 - lobbyData.players.length).fill('empty');
    }, [lobbyData])

    const PlayerPlaces = useMemo(() => {
        return lobbyData.players.map((player: {username: string, _id: Types.ObjectId}) => (
            <div
                className='w-1/6 border-accent border-2 rounded-2xl p-4 h-[120px] flex justify-center items-center'
                key={player._id.toString()}
                onClick={() => toggleSidebar(player._id.toString())}
            >
                {player.username}
            </div>
        ))
    }, [lobbyData])

    console.log(lobbyData.status === 'active' || isGameStarted)

    return (
        <div className='flex flex-col gap-4 justify-center items-center'>
            <h2 className='text-4xl primary-text-gradient font-rubik-dirt'>Players</h2>
            {/*<div*/}
            {/*    className='border-2 border-accent px-4 py-6 rounded-sm w-full justify-center h-full flex gap-4 flex-wrap'>*/}
            {/*    {PlayerPlaces}*/}
            {/*    {emptyPlayerPlaces.map((player, index) => (*/}
            {/*        <div*/}
            {/*            className='w-1/6 border-accent border-2 rounded-2xl p-4 h-[120px] flex justify-center items-center'*/}
            {/*            key={index}*/}
            {/*        >*/}
            {/*            Empty*/}
            {/*        </div>*/}
            {/*    ))}*/}
            {/*    <LeftSideBar*/}
            {/*        isOpen={isSidebarOpen}*/}
            {/*        onClose={() => setIsSidebarOpen(false)}*/}
            {/*    />*/}
            {/*</div>*/}
            <div className='w-[70vw] rounded-2xl border-2 h-[70vh]'>
                table
            </div>
            { (lobbyData.status === 'active' || isGameStarted) && <GameHand />}
            <div
                className='flex justify-center items-center w-1/5 fixed left-0 bottom-0 border-x-2 border-t-2 p-4 pb-8 rounded-t-2xl'>
                <Button onClick={handleLeave}>Leave</Button>
                {
                    isCreator && lobbyData.status !== 'active' && <Button disabled={isGameStarted} onClick={createGameHandler}>Start Game</Button>
                }
            </div>
        </div>
    );
};

export default LobbyBoard;