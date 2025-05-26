import React from 'react';
import LobbyManager from "@/components/lobby/LobbyManager";
import {notFound, redirect} from "next/navigation";
import {auth} from "@/auth";

const LobbyPage = async ({params}: { params: Promise<{ lobbyId: string }>}) => {

    const {lobbyId} = await params

    if (!lobbyId) return notFound();

    const session = await auth()

    if (!session) {
        return redirect("/sign-in");
    }

    return <LobbyManager lobbyId={lobbyId} />

};

export default LobbyPage;