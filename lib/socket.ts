import {io, Socket} from "socket.io-client";
import {ILobbyDoc, ILobbyDocWithUsers} from "@/models/Lobby.model";
import {IUserDoc} from "@/models/User.model";

export interface ClientToServerEvents {
    lobby_join: (data: { lobbyId: string, userId: string }) => void;
    lobby_leave: (data: { lobbyId: string; userId: string }) => void;
    lobby_update: (data: { text: string; room: string }) => void;
    game_start: (data: { gameId: string, lobbyId: string }) => void;
    send_character: (data: { lobbyId: string, userId: string }) => void;
    get_player_character: (data: { lobbyId: string, playerId: string, currentUserId: string }) => void;
}

export interface ServerToClientEvents {
    lobby_join: (data: { text: string; user: string }) => void;
    lobby_data: (data:{currentLobby: ILobbyDoc, currentUser: IUserDoc}) => void;
    leave_from_lobby: (data:{lobby: ILobbyDocWithUsers, userId: string}) => void;
    error: (data: { message: string }) => void;
    game_started: (data:{gameData: string}) => void;
    get_own_character: (data:{character: string}) => void;
    send_player_character: (data:{character: string}) => void;
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:5000", {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
})