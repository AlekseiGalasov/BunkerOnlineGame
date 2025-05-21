import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import {getAccountByProvider, getUserById, loginWithOAuth} from "@/lib/actions/auth.action";
import {ActionResponse} from "@/types/global";
import {IAccountDoc} from "@/models/Account.model";
import Credentials from "@auth/core/providers/credentials";
import {SignInSchema} from "@/lib/validations/validations";
import bcrypt from "bcryptjs";
import { IUserDoc } from "./models/User.model";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google,
        Credentials({
            authorize: async (credentials) => {
                let user = null;
                const validatedData = SignInSchema.safeParse(credentials)

                if (validatedData.success) {
                    const {password, email} = validatedData.data

                    const {data: existingAccount} = await getAccountByProvider({providerAccountId: email}) as ActionResponse<IAccountDoc>

                    if (!existingAccount) return null

                    const {data: existingUser} = await getUserById({userId: existingAccount.userId.toString()}) as ActionResponse<IUserDoc>
                    if (!existingUser) return null

                    const isValidPassword = await bcrypt.compare(password, existingAccount.password!)

                    if (isValidPassword) {
                        user = {
                            id: existingUser.id,
                            name: existingUser.name,
                            email: existingUser.email,
                            image: existingUser.image,
                        }
                    }
                }
                return user
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            session.user.id = token.sub as string;
            return session;
        },
        async signIn({user, account}) {
            if (account?.type === "credentials") return true;
            if (!account || !user) return false;

            const userInfo = {
                email: user.email!,
                image: user.image!,
                username: user.name!,
            };

            const { success } = (await loginWithOAuth({
                user: userInfo,
                provider: account.provider as "discord" | "google",
                providerAccountId: account.providerAccountId,
            })) as ActionResponse;

            return success;

        },
        async jwt({ token, account }) {
            if (account) {
                const providerAccountId = account.type === "credentials" ? token.email! : account.providerAccountId
                const { data: existingAccount, success } = (await getAccountByProvider({providerAccountId})) as ActionResponse<IAccountDoc>;

                if (!success || !existingAccount) return token;

                const userId = existingAccount.userId;

                if (userId) token.sub = userId.toString();
            }

            return token;
        },
    }
})