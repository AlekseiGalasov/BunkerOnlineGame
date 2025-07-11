
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

interface ScenarioParams {
    label: string
    checked: boolean
    value: string
}

interface CardParams {
    name: string
    type: "profession" | "health" | "phobia" | "hobby" | "luggage" | "special" | "bio" | "additional"
    description: string
    level: number
    scenario: ScenarioParams[]
    tags?: TagParams[]
    image?: string
}

interface UpdateCardParams extends CardParams {
    id: string
}

interface TagParams {
    _id: string
    name: boolean
}

interface CreateScenarioParams {
    name: string
    description: string
    winCondition?: TagParams[]
    looseCondition?: TagParams[]
    isPublic: boolean
    image?: string
}

interface PaginationSearchParams {
    page?: number
    pageSize?: number
    query?: string
    filter?: string
    sort?: string
    cardType?: "profession" | "health" | "phobia" | "hobby" | "luggage" | "special" | "all"
}


interface LobbyIdParams {
    id: string
}

interface getCardByIdParams {
    id: string
}

interface getScenarioIdParams {
    id: string
}

interface JoinToLobbyParams extends LobbyIdParams {
    password?: string;
}