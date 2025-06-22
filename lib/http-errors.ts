

export class RequestError extends Error {
    statusCode: number;
    errors?: Record<string, string[]>
    code?: string;

    constructor(
        statusCode: number,
        message: string,
        errors?: Record<string, string[]>,
        code?: string,
    ) {
        super(message);
        this.statusCode = statusCode
        this.code = code
        this.errors = errors
        this.name = 'RequestError'
    }
}

export class ValidationError extends RequestError {
    constructor(fieldErrors: Record<string, string[]>) {
        const message = ValidationError.formatFieldMessage(fieldErrors)
        super(400,message, fieldErrors);
        this.name = 'ValidationError'
        this.errors = fieldErrors
    }

    static formatFieldMessage(errors: Record<string, string[]>): string {
        const formattedMessages = Object.entries(errors).map(([field, message]) => {
            const fieldName = field.charAt(0).toUpperCase() + field.slice(1)

            if (message[0] === 'Required') {
                return `${fieldName} is required`
            } else {
                return message.join(" and ")
            }
        })
        return formattedMessages.join(', ')
    }
}

export class NotFoundError extends RequestError {
    constructor(resource: string, code?: string) {
        super(404, `${resource} not found`);
        this.name = 'NotFoundError'
        this.code = code
    }
}

export class ForbiddenError extends RequestError {
    constructor(message: string = 'Forbidden', code: string = 'forbidden') {
        super(403, message);
        this.name = 'ForbiddenError'
        this.code = code
    }
}

export class UnauthorizedError extends RequestError {
    constructor(message: string = 'Unauthorized') {
        super(401, message);
        this.name = 'UnauthorizedError'
    }
}

export class CustomError extends RequestError {
    constructor(message: string = 'Forbidden', code: string = 'forbidden', statusCode: number = 500) {
        super(statusCode, message);
        this.name = 'Error'
        this.code = code
    }
}