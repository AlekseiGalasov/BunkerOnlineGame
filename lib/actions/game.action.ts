'use server'

import Game from "@/models/Game.model";
import mongoose, {Types} from "mongoose";
import handleError from "@/handlers/error";
import Lobby, {ILobbyDocWithIds} from "@/models/Lobby.model";
import {redisClient} from "@/lib/redis";
import Character from "@/models/Character.model";
import {cacheCharacter, dealCards, prepareCardPools, randomInteger} from "@/lib/helpers/generateCharacter";

export async function createGame({lobbyId}: {lobbyId: Types.ObjectId}): Promise<ActionResponse<{id: string}>> {

    const session = await mongoose.startSession()
    session.startTransaction()

    try {

        const currentLobby: ILobbyDocWithIds = await Lobby.findById(lobbyId).session(session)

        const totalSurvivals = Math.ceil(currentLobby.players.length / 2)

        const totalRounds = currentLobby.players.length - totalSurvivals

        const [newGame] = await Game.create([{
            stage: 'waiting',
            totalPlayers: currentLobby.players.length,
            activePlayers: currentLobby.players.length,
            totalRounds,
            totalSurvivals,
            currentSpeaker: 0,
            round: 1,
            characters: []
        }], {session})

        if (!newGame) {
            throw new Error("Failed to create game");
        }

        const cardPools = await prepareCardPools();
        const assignedCards = dealCards(cardPools, currentLobby.players.length);

        const characterPromises = currentLobby.players.map(async (userId, index) => {
            const characterCards = [
                { isOpen: false, card: { name: assignedCards.profession[index].name, type: 'profession', level: assignedCards.profession[index].level}},
                { isOpen: false, card: { name: assignedCards.phobia[index].name, type: 'phobia', level: assignedCards.phobia[index].level}},
                { isOpen: false, card: { name: `${assignedCards.bio[index].name} ${assignedCards.bio[index].description}`, type: 'bio', level: randomInteger(18, 99)}},
                { isOpen: false, card: { name: assignedCards.health[index].name, type: 'health', level: assignedCards.health[index].level}},
                { isOpen: false, card: { name: assignedCards.hobby[index].name, type: 'hobby', level: assignedCards.hobby[index].level}},
                { isOpen: false, card: { name: assignedCards.additional[index].name, type: 'additional', level: assignedCards.additional[index].level}}
            ];

            const [newCharacter] = await Character.create([{
                lobbyId,
                userId,
                cards: characterCards
            }], {session});

            await cacheCharacter(newCharacter)

            return newCharacter._id
        });

        await Lobby.findByIdAndUpdate(
            lobbyId,
            { status: 'active', gameId: newGame._id},
            { session }
        )

        newGame.characters = await Promise.all(characterPromises);
        await newGame.save({ session });

        await redisClient.set(`game_${newGame._id}`, JSON.stringify(newGame), 'EX', 60 * 60)

        await session.commitTransaction();

        return { success: true, data: {id: newGame._id.toString()} };

    } catch (error) {
        await session.abortTransaction();
        return handleError(error, 'server') as ErrorResponse
    } finally {
        await session.endSession()
    }
}