'use server'

import Card, {ICard} from "@/models/Card.model";
import action from "@/handlers/action";
import {CardSchema} from "@/lib/validations/validations";
import handleError from "@/handlers/error";


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