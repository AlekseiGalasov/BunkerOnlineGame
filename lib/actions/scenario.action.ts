'use server'

import action from "@/handlers/action";
import {PaginationSearchParamsSchema, ScenarioSchema} from "@/lib/validations/validations";
import handleError from "@/handlers/error";
import {NotFoundError} from "@/lib/http-errors";
import Scenario, {IScenario} from "@/models/Scenario.model";


export async function createScenario(params: CreateScenarioParams): Promise<ActionResponse<IScenario>> {

    const validationResult = await action({
        params,
        schema: ScenarioSchema,
        authorize: true
    })

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const {image, isPublic, looseCondition, winCondition, description, name} = params as CreateScenarioParams
    const newWinCondition = winCondition.map((elem: Tag) => elem._id)
    const newLooseCondition = looseCondition.map((elem: Tag) => elem._id)

    const userId = validationResult.session?.user?.id

    try {

        const newScenario = await Scenario.create({
            name,
            author: userId,
            isPublic,
            looseCondition: newLooseCondition,
            winCondition: newWinCondition,
            description,
            image,
        })

        if (!newScenario) throw new Error("Failed to create scenario");

        return {success: true, data: JSON.parse(JSON.stringify(newScenario))};
    } catch (error) {
        return handleError(error, 'server') as ErrorResponse
    }
}

export async function getAllScenariosForSelect(params: PaginationSearchParams): Promise<ActionResponse<{scenarios: IScenario[], isNext: boolean, totalPages: number}>> {

    const validationResult = await action({
        params,
        schema: PaginationSearchParamsSchema,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const { pageSize = 10, page = 1 } = validationResult.params as PaginationSearchParams
    const skip = (Number(page) - 1) * pageSize
    const limit = Number(pageSize)


    try {

        const totalScenarios = await Scenario.countDocuments()
        const totalPages = Math.ceil(totalScenarios / limit)
        const scenarios = await Scenario.find()
            .select('name')
            .skip(skip)
            .limit(limit)

        if (!scenarios) {
            throw new NotFoundError('Scenarios not found')
        }

        const isNext = totalScenarios > skip + scenarios.length
        return { success: true, data: {scenarios: JSON.parse(JSON.stringify(scenarios)), isNext, totalPages }}

    } catch (error) {
        return handleError(error, 'server') as ErrorResponse
    }
}

export async function getScenarioById(params: getScenarioIdParams): Promise<ActionResponse<{scenario: IScenario}>> {

    const validationResult = await action({
        params,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse
    }

    const { id } = params as getCardByIdParams

    try {

        const scenario = await Scenario.findOne({_id: id})

        if (!scenario) {
            throw new NotFoundError('Scenario not found')
        }

        return { success: true, data: {scenario: JSON.parse(JSON.stringify(scenario)) }}

    } catch (error) {
        return handleError(error, 'server') as ErrorResponse
    }
}