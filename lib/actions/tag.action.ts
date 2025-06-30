"use server"


import action from "@/handlers/action";
import {PaginationSearchParamsSchema, TagSchema} from "@/lib/validations/validations";
import handleError from "@/handlers/error";
import Tags, {ITag} from "@/models/Tag.model";
import mongoose from 'mongoose';
import Card, {ICard} from "@/models/Card.model";
import {NotFoundError} from "@/lib/http-errors";

export async function createTags(params: TagParams): Promise<ActionResponse> {

    const validationResult = await action({
        params,
        schema: TagSchema,
        authorize: true
    })

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const {name} = params
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        for (const tag of name) {
            await Tags.findOneAndUpdate(
                { name: { $regex: new RegExp(`^${tag}$`, "i") } },
                { $setOnInsert: { name: tag }},
                {upsert: true, new: true}
            )
        }

        await session.commitTransaction();

        return { success: true };

    } catch (error) {
        await session.abortTransaction();

        return handleError(error, 'server') as ErrorResponse
    } finally {
        await session.endSession()
    }

}

export async function getAllTags(params: PaginationSearchParams): Promise<ActionResponse<{tags: ITag[], isNext: boolean, totalPages: number}>> {

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

    try {

        const totalTags = await Tags.countDocuments()
        const totalPages = Math.ceil(totalTags / limit)
        const cards = await Tags.find()
            .select('name')
            .skip(skip)
            .limit(limit)

        if (!cards) {
            throw new NotFoundError('Cards not found')
        }

        const isNext = totalTags > skip + cards.length
        return { success: true, data: {tags: JSON.parse(JSON.stringify(cards)), isNext, totalPages }}

    } catch (error) {
        return handleError(error, 'server') as ErrorResponse
    }
}