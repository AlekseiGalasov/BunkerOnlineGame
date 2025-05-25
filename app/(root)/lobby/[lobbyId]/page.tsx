import React from 'react';
import LobbyManager from "@/components/lobby/LobbyManager";

const LobbyPage = async ({params}: { params: Promise<{ lobbyId: string }>}) => {

    const {lobbyId} = await params

    return (
        <div>
            LobbyId: {lobbyId}
            <LobbyManager lobbyId={lobbyId} />
        </div>
    );
};

export default LobbyPage;