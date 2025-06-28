'use server'

import Card, {ICard} from "@/models/Card.model";
import action from "@/handlers/action";
import {CardSchema, PaginationSearchParamsSchema} from "@/lib/validations/validations";
import handleError from "@/handlers/error";
import {NotFoundError} from "@/lib/http-errors";


export async function createCard(params: CardParams): Promise<ActionResponse<ICard>> {

    const validationResult = await action({
        params,
        schema: CardSchema,
        authorize: true
    })

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const {scenario, name, type, level, description} = params

    try {

        const newCard = await Card.create({
            name,
            scenario,
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

    const { sort, query, pageSize = 5, page = 1, cardType } = validationResult.params as PaginationSearchParams
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