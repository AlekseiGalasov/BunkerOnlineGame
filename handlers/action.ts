'use server'

import {Session} from "next-auth";
import {ZodError, ZodSchema} from "zod";

import {auth} from "@/auth";
import {UnauthorizedError, ValidationError} from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";

type ActionOption<T> = {
    params?: T;
    schema?: ZodSchema<T>;
    authorize?: boolean;
};

async function action<T>({ authorize = false, params, schema }: ActionOption<T>) {

    if (schema && params) {
        try {
            schema.parse(params)
        } catch (error) {
            if (error instanceof ZodError) {
                return new ValidationError(error.flatten().fieldErrors as Record<string, string[]>)
            } else {
                return new Error("Schema validation failed")
            }
        }
    }

    let session: Session | null = null

    if (authorize) {
        session = await auth()

        if (!session) {
            return new UnauthorizedError()
        }
    }

    await dbConnect()

    return { params, session }
}

export default action;