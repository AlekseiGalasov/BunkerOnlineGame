export const ROUTES = {
    HOME: '/',
    SIGN_IN: '/sign-in',
    SIGN_UP: '/sign-up',
    LOBBIES: '/lobby',
    CREATE_LOBBY: '/lobby/create',
    LOBBY: (id: string) => `/lobby/${id}`,
}