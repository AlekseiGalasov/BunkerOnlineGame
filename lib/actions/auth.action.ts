"use server"

import action from "@/handlers/action";
import {AccountSchema, SignInSchema, SignInWithOAuthSchema, UserSchema} from "@/lib/validations/validations";
import handleError from "@/handlers/error";
import mongoose from 'mongoose';
import {ActionResponse, ErrorResponse} from "@/types/global";
import User, {IUserDoc} from "@/models/User.model";
import Account, {IAccountDoc} from "@/models/Account.model";
import {NotFoundError, ValidationError} from "@/lib/http-errors";
import dbConnect from "../mongoose";
import bcrypt from 'bcryptjs'
import {signIn} from "@/auth";

export async function loginWithOAuth(params: AuthWithOAuthParams): Promise<ActionResponse> {

    const validationResult = await action({
        params,
        schema: SignInWithOAuthSchema
    })

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const {providerAccountId, provider, user} = validationResult.params as AuthWithOAuthParams
    const {username, image, email} = user

    const session = await mongoose.startSession();
    session.startTransaction()

    try {

        let existingUser = await User.findOne({ email }).session(session);

        if (!existingUser) {
            [existingUser] = await User.create([{ username, email, image}], { session })
        } else {
            const updatedData: {username: string, image?: string} = {
                username: existingUser.username
            }

            if (existingUser.username !== username) updatedData.username = username
            if (existingUser.image !== image) updatedData.image = image

            if (Object.keys(updatedData).length > 0) {
                await User.updateOne(
                    { _id: existingUser._id },
                    { $set: updatedData }
                ).session(session);
            }
        }

        const existingAccount = await Account.findOne({
            userId: existingUser._id,
            provider,
            providerAccountId,
        }).session(session);

        if (!existingAccount) {
            await Account.create(
                [
                    {
                        userId: existingUser._id,
                        name: username,
                        image,
                        provider,
                        providerAccountId,
                    },
                ],
                { session }
            );
        }

        await session.commitTransaction();

        return { success: true }

    } catch (error) {
        await session.abortTransaction()
        return handleError(error, 'server') as ErrorResponse
    } finally {
        await session.endSession()
    }
}

export async function authWithCredentials(params: AuthWithCredentialParams): Promise<ActionResponse> {

    const validationResult = await action({
        params,
        schema: SignInSchema
    })

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const {username, email, password} = validationResult.params as AuthWithCredentialParams

    const session = await mongoose.startSession();
    session.startTransaction()

    try {

        const existedUser = await User.findOne({ email }).session(session)

        if (existedUser) {
            throw new Error('User already exists')
        }

        const existedUserName = await User.findOne({ username }).session(session)

        if (existedUserName) {
            throw new Error('Username already exists')
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const [newUser] = await User.create([{ username, email }], { session })

        await Account.create([
                {
                    userId: newUser._id,
                    name: username,
                    password: hashedPassword,
                    provider: 'credentials',
                    providerAccountId: email
                }],
            { session }
        )

        await session.commitTransaction();
        await signIn('credentials', { email, password, redirect: false})

        return { success: true }
    } catch (error) {
        await session.abortTransaction()
        return handleError(error, 'server') as ErrorResponse
    } finally {
        await session.endSession()
    }

}

export async function loginWithCredentials(params: Pick<AuthWithCredentialParams, 'email' | 'password'>): Promise<ActionResponse> {
    const validationResult = await action({params, schema: SignInSchema})

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const {password, email} = validationResult.params as Pick<AuthWithCredentialParams, 'email' | 'password'>

    try {
        const user = await User.findOne({ email }) as IUserDoc

        if (!user) throw new NotFoundError('User')

        const existedUserAccount = await Account.findOne({provider: 'credentials', providerAccountId: email}) as IAccountDoc

        if (!existedUserAccount) throw new NotFoundError('Account')

        const isValidPassword = await bcrypt.compare(password, existedUserAccount.password!)

        if (!isValidPassword) throw new Error('Wrong Email or Password')

        await signIn('credentials', { email, password, redirect: false})
        return { success: true }
    } catch (error) {
        return handleError(error) as ErrorResponse
    }
}

export async function getAccountByProvider ({providerAccountId}: {providerAccountId: string}): Promise<ActionResponse<IAccountDoc>> {

    if (!providerAccountId) throw new NotFoundError('Account')

    try {
        await dbConnect();
        const validatedProviderId = AccountSchema.partial().safeParse({providerAccountId})

        if (!validatedProviderId.success) {
            throw new ValidationError(validatedProviderId.error.flatten().fieldErrors) // Validation Error
        }

        const account = await Account.findOne({ providerAccountId })

        if (!account) throw new NotFoundError('Account')

        return {success: true, data: account, status: 200}

    } catch (error) {
        return handleError(error, 'server') as ErrorResponse
    }

}

export async function getUserById ({userId}: {userId: string}): Promise<ActionResponse<IUserDoc>> {

    if (!userId) throw new NotFoundError('User')

    try {
        await dbConnect();

        const user = await User.findById(userId)

        if (!user) throw new NotFoundError('Can not find User')

        return {success: true, data: user, status: 200}

    } catch (error) {
        return handleError(error, 'server') as ErrorResponse
    }

}