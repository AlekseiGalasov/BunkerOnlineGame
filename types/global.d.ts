type ActionResponse<T = null> = {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        details?: Record<string, string[]>;
        code?: string;
    };
    status?: number;
};

interface User {
    _id: string
    username: string
    email: string
    image: string
    totalGames?: number
    totalWins?: number
}

interface Lobby {
    creator: string
    isVisible: boolean
    maxPlayer: number
    name: string
    password?: string
    countPlayers?: string
    isProtected?: boolean
    players: User[]
    scenario: string
    status: "waiting" | "active" | "closed"
    createdAt: string
    updatedAt: string
    _id: string
}

type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
type ErrorResponse = ActionResponse<undefined> & { success: false };
