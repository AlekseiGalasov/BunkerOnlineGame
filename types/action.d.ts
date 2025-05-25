
interface AuthWithCredentialParams {
    username: string;
    password: string;
    email: string;
}

interface AuthWithOAuthParams {
    provider: 'google' | 'discord';
    providerAccountId: string;
    user: {
        username: string,
        email: string,
        image?: string
    };
}

interface LobbyParams {
    name: string
    password?: string
    scenario: string
    maxPlayer: number
    isVisible: boolean
}

interface LobbyIdParams {
    id: string
}

interface JoinToLobbyParams extends LobbyIdParams {
    password?: string;
}