'use client'

import React from 'react';
import {ILobby} from "@/models/Lobby.model";

interface LobbyBoardParams {
    lobbyData: ILobby
}

const LobbyBoard = (params: LobbyBoardParams) => {

    const {lobbyData} = params

    return (
        <div>
            
        </div>
    );
};

export default LobbyBoard;