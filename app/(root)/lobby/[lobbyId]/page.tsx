import React from 'react';

const LobbyPage = async ({params}: { params: Promise<{ lobbyId: string }>}) => {

    const {lobbyId} = await params

    return (
        <div>
            LobbyId: {lobbyId}
        </div>
    );
};

export default LobbyPage;