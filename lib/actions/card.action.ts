'use server'

import Card, {ICard, ICardDoc} from "@/models/Card.model";
import action from "@/handlers/action";
import {CardSchema, PaginationSearchParamsSchema, UpdateCardSchema} from "@/lib/validations/validations";
import handleError from "@/handlers/error";
import {NotFoundError} from "@/lib/http-errors";
import mongoose from "mongoose";


export async function createCard(params: CardParams): Promise<ActionResponse<ICard>> {

    const validationResult = await action({
        params,
        schema: CardSchema,
        authorize: true
    })

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const {scenario, name, type, level, description, tags} = params as CardParams
    const userId = validationResult.session?.user?.id

    const scenariosObectIds = scenario.map(scenario => {
        return scenario._id
    })

    const tagsObectIds = tags.map(tag => {
        return tag._id
    })

    try {

        await Card.updateMany({}, { isUnique: true })

        const newCard = await Card.create({
            name,
            author: userId,
            scenarios: scenariosObectIds,
            tags: tagsObectIds,
            isUnique: type !== 'bio',
            type,
            level,
            description,
        })

        if (!newCard) throw new Error("Failed to create the card");

        return {success: true, data: JSON.parse(JSON.stringify(newCard))};
    } catch (error) {
        return handleError(error, 'server') as ErrorResponse
    }
}

export async function getAllCards(params: PaginationSearchParams): Promise<ActionResponse<{cards: ICard[], isNext: boolean, totalPages: number}>> {

    const validationResult = await action({
        params,
        schema: PaginationSearchParamsSchema,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const { pageSize = 5, page = 1, cardType } = validationResult.params as PaginationSearchParams
    const skip = (Number(page) - 1) * pageSize
    const limit = Number(pageSize)

    let sortCriteria = {}

    if (!cardType || cardType !== 'all') {
        sortCriteria = {type: cardType}
    }

    try {

        const totalCards = await Card.countDocuments(sortCriteria)
        const totalPages = Math.ceil(totalCards / limit)
        const cards = await Card.find(sortCriteria)
            .skip(skip)
            .limit(limit)

        if (!cards) {
            throw new NotFoundError('Cards not found')
        }

        const isNext = totalCards > skip + cards.length
        return { success: true, data: {cards: JSON.parse(JSON.stringify(cards)), isNext, totalPages }}

    } catch (error) {
        return handleError(error, 'server') as ErrorResponse
    }
}

export async function getCardById(params: getCardByIdParams): Promise<ActionResponse<{card: ICard}>> {

    const validationResult = await action({
        params,
        authorize: true
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const { id } = params as getCardByIdParams
    const userId = validationResult.session?.user?.id

    try {

        const card = await Card.findOne({_id: id, author: userId}).populate({path: 'tags', select: 'name'}) as ICardDoc

        if (!card) {
            throw new NotFoundError('Card not found')
        }

        return { success: true, data: {card: JSON.parse(JSON.stringify(card)) }}

    } catch (error) {
        return handleError(error, 'server') as ErrorResponse
    }
}

export async function editCard(params: UpdateCardParams): Promise<ActionResponse<ICard>> {

    const validationResult = await action({
        params,
        schema: UpdateCardSchema,
        authorize: true
    })

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const { type, scenario, name, description, level, image, tags, id } = validationResult.params as UpdateCardParams
    const userId = validationResult.session?.user?.id

    const session = await mongoose.startSession();
    session.startTransaction()

    const scenariosObectIds = scenario.map(scenario => {
        return scenario._id
    })

    const tagsObectIds = tags.map(tag => {
        return tag._id
    })

    try {

        const card = await Card.findById(id).populate('scenarios') as ICardDoc

        if (!card) {
            throw new Error('Card not found')
        }

        if (card.author.toString() !== userId) {
            throw new Error('Unauthorized')
        }

        if (card.name !== name ||
            card.description !== description ||
            card.type !== type ||
            card.level !== level ||
            card.image !== image
        ) {
            card.name = name
            card.description = description
            card.type = type
            card.level = level
            card.image = image
            await card.save({session})
        }

        card.scenarios = scenariosObectIds
        card.tags = tagsObectIds
        await card.save({session})

        await session.commitTransaction()

        return { success: true, data: JSON.parse(JSON.stringify(card))};

    } catch (error) {
        await session.abortTransaction()
        return handleError(error) as ErrorResponse
    } finally {
        await session.endSession()
    }
}