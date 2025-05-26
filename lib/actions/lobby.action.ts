'use server'

import {ActionResponse, ErrorResponse} from "@/types/global";
import action from "@/handlers/action";
import {LobbySchema} from "@/lib/validations/validations";
import handleError from "@/handlers/error";
import Lobby, {ILobbyDoc} from "@/models/Lobby.model";
import {revalidatePath} from "next/cache";
import {ROUTES} from "@/constants/route";
import {ForbiddenError, NotFoundError} from "@/lib/http-errors";

export async function createLobby(params: LobbyParams): Promise<ActionResponse<ILobbyDoc>> {

    const validationResult = await action({
        params,
        schema: LobbySchema,
        authorize: true
    })

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const {password, name, scenario, maxPlayer, isVisible} = validationResult.params as LobbyParams
    const userId = validationResult.session?.user?.id

    try {
        const existingLobby = await Lobby.findOne({name: name, status: {$in: ['active', 'waiting']}});

        if (existingLobby) {
            throw new Error(`Lobby with ${name} already exists`);
        }

        const newLobby = await Lobby.create({
            name,
            password,
            scenario,
            maxPlayer,
            players: [],
            creator: userId,
            isVisible,
            status: 'waiting',
        })

        if (!newLobby) throw new Error("Failed to create the lobby");

        return {success: true, data: JSON.parse(JSON.stringify(newLobby))};
    } catch (error) {
        return handleError(error, 'server') as ErrorResponse
    }
}

export async function leaveFromLobby(params: LobbyIdParams): Promise<ActionResponse> {

    const validationResult = await action({
        params,
        authorize: true
    })

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const {id} = validationResult.params as LobbyIdParams
    const userId = validationResult.session?.user?.id

    try {

        const existingLobby = await Lobby.findOne({
            _id: id,
            status: {$in: ['active', 'waiting']},
            players: {$in: [userId]}
        },);

        if (!existingLobby) {
            throw new Error(`lobby not exist or already closed`);
        }

        if (existingLobby.players.length === 1) {
            existingLobby.status = 'closed'
        }

        existingLobby.players.pull(userId)
        await existingLobby.save()

        revalidatePath(ROUTES.LOBBY(id));

        return {success: true};
    } catch (error) {
        return handleError(error, 'server') as ErrorResponse
    }
}

export async function joinToLobby(params: JoinToLobbyParams): Promise<ActionResponse<ILobbyDoc>> {

    const validationResult = await action({
        params,
        authorize: true
    })

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const {id, password} = validationResult.params as JoinToLobbyParams
    const userId = validationResult.session?.user?.id

    try {

        const existingLobby = await Lobby.findOne({
            _id: id,
            status: {$in: ['active', 'waiting']},
        },);

        if (!existingLobby) {
            throw new NotFoundError(`lobby not exist or already closed`);
        }

        if (existingLobby.players.includes(userId)) {
            return {success: true, data: JSON.parse(JSON.stringify(existingLobby))};
        }

        if (existingLobby.players.length >= existingLobby.maxPlayer) {
            throw new Error(`lobby already full`);
        }

        if (existingLobby.password) {
            if (!password) {
                throw new ForbiddenError('Message', 'code');
            }
            if (existingLobby.password !== password) {
                throw new Error(`Wrong Password!`);
            }
        }

        existingLobby.players.push(userId)
        await existingLobby.save()

        return {success: true, data: JSON.parse(JSON.stringify(existingLobby))};
    } catch (error) {
        return handleError(error, 'server') as ErrorResponse
    }
}