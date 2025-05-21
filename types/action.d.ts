
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