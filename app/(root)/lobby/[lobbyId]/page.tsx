import React from 'react';
import LobbyManager from "@/components/lobby/LobbyManager";
import {notFound, redirect} from "next/navigation";
import {auth} from "@/auth";
import {joinToLobby} from "@/lib/actions/lobby.action";
import {ILobby, ILobbyDocWithUsers} from "@/models/Lobby.model";
import {IUserDoc} from "@/models/User.model";
import ErrorRenderer from "@/components/ErrorRenderer";
import {ROUTES} from "@/constants/route";
import LobbyPasswordForm from "@/components/forms/LobbyPasswordForm";

const LobbyPage = async ({params}: { params: Promise<{ lobbyId: string }>}) => {

    const {lobbyId} = await params

    if (!lobbyId) return notFound();

    const session = await auth()

    if (!session) {
        return redirect("/sign-in");
    }

    const result: ActionResponse<ILobbyDocWithUsers> = await joinToLobby({ id: lobbyId });

    switch (result?.error?.code) {
        case "not_exist":
            return <ErrorRenderer error={{message: 'Lobby not exist ore already closed'}}
                                  button={{text: 'go to the main page', href: ROUTES.HOME}}/>
        case "full_lobby":
            return <ErrorRenderer error={{message: 'Lobby is full'}}
                                  button={{text: 'go to the main page', href: ROUTES.HOME}}/>
        case "required_password":
        case "invalid_password":
            return <LobbyPasswordForm lobbyId={lobbyId} />
    }

    if (!result.data) {
        return null
    }

    return <LobbyManager lobbyId={result.data._id} />

};

export default LobbyPage;