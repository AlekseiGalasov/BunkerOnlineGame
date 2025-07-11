'use server'

import {ActionResponse, ErrorResponse, Lobby as LobbyInterface} from "@/types/global";
import action from "@/handlers/action";
import {LobbySchema, PaginationSearchParamsSchema} from "@/lib/validations/validations";
import handleError from "@/handlers/error";
import Lobby, {ILobbyDocWithIds} from "@/models/Lobby.model";
import {revalidatePath} from "next/cache";
import {ROUTES} from "@/constants/route";
import {CustomError, ForbiddenError, NotFoundError} from "@/lib/http-errors";
import bcrypt from "bcryptjs";
import Game from "@/models/Game.model";

export async function createLobby(params: LobbyParams): Promise<ActionResponse<ILobbyDocWithIds>> {

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
        const existingLobby = await Lobby.findOne({name: name, status: {$in: ['active', 'waiting', 'closed']}});

        if (existingLobby) {
            throw new Error(`Lobby with ${name} already exists`);
        }

        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 12)
        }

        const newLobby = await Lobby.create({
            name,
            password: hashedPassword,
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
            existingLobby.status = 'waiting' // set to closed in prod test!!!!
        }

        existingLobby.players.pull(userId)
        await existingLobby.save()

        revalidatePath(ROUTES.LOBBY(id));

        return {success: true};
    } catch (error) {
        return handleError(error, 'server') as ErrorResponse
    }
}

export async function joinToLobby(params: JoinToLobbyParams): Promise<ActionResponse<LobbyInterface>> {

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

        let existingLobby = await Lobby.findOne({
            _id: id,
            status: {$in: ['active', 'waiting']},
        },).populate('players');

        if (!existingLobby) {
            throw new NotFoundError(`lobby not exist or already closed`, 'not_exist');
        }

        if (Object.values(existingLobby.players).some(player => player.id === userId)) {
            return {success: true, data: JSON.parse(JSON.stringify(existingLobby))};
        }

        if (existingLobby.players.length >= existingLobby.maxPlayer) {
            throw new CustomError('Lobby already full', 'full_lobby', 409);
        }

        if (existingLobby.password) {
            if (!password) {
                throw new ForbiddenError('Required a password', 'required_password');
            }
            const isValidPassword = await bcrypt.compare(password, existingLobby.password!)

            if (!isValidPassword) {
                throw new ForbiddenError('Wrong password', 'invalid_password');
            }

            revalidatePath(ROUTES.LOBBY(id));
        }

        existingLobby.players.push(userId)
        await existingLobby.save()

        existingLobby = await Lobby.findOne({
            _id: id,
            status: {$in: ['active', 'waiting']},
        },).populate('players');

        return {success: true, data: JSON.parse(JSON.stringify(existingLobby))};
    } catch (error) {
        return handleError(error, 'server') as ErrorResponse
    }
}

export async function getAllLobbies(params: PaginationSearchParams): Promise<ActionResponse<{lobbies: LobbyInterface[], isNext: boolean, totalPages: number}>> {

    const validationResult = await action({
        params,
        schema: PaginationSearchParamsSchema,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const { pageSize = 5, page = 1 } = validationResult.params as PaginationSearchParams
    const skip = (Number(page) - 1) * pageSize
    const limit = Number(pageSize)

    //const filterQuery: FilterQuery<typeof Lobby> = {}

    try {

        const totalLobbies = await Lobby.countDocuments({
            isVisible: true,
            password: {$not: {$eq: ''}},
            status: {$in: ['active', 'waiting']},
        })
        const totalPages = totalLobbies > 0 ? Math.ceil(totalLobbies / limit) : 1

        const lobbies = await Lobby.find({
            isVisible: true,
            password: {$not: {$eq: ''}},
            status: {$in: ['active', 'waiting']},
        })
            .select('name status scenario maxPlayer createdAt players password')
            .lean({ virtuals: ['isProtected', 'countPlayers']})
            .skip(skip)
            .limit(limit)

        if (!lobbies) {
            throw new NotFoundError('Lobbies not found')
        }

        lobbies.forEach((lobby) => {
            delete lobby.password;
            delete lobby.players;
        });

        const isNext = totalLobbies > skip + lobbies.length
        return { success: true, data: {lobbies: JSON.parse(JSON.stringify(lobbies)), isNext, totalPages }}

    } catch (error) {
        return handleError(error, 'server') as ErrorResponse
    }
}

export async function getLobby(params: LobbyIdParams): Promise<ActionResponse<{lobby: LobbyInterface[]}>> {

    const validationResult = await action({
        params,
        authorize: true
    })

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const {id} = validationResult.params as LobbyIdParams

    try {

        const lobby = await Lobby.findById(id)
            .select('name status scenario maxPlayer createdAt players')
            .populate('players')
            .lean()

        if (!lobby) {
            throw new NotFoundError('lobby not found')
        }

        return { success: true, data: {lobby: JSON.parse(JSON.stringify(lobby)) }}

    } catch (error) {
        return handleError(error, 'server') as ErrorResponse
    }
}