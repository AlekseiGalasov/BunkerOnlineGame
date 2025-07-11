import { z } from 'zod'


export const SignUpSchema = z.object({
    email: z.string().email(),
    username: z.string().min(3, 'username is required').max(20, 'username maximum can have 20 characters'),
    password: z.string().min(6, 'password must be at least 6 characters').max(20, 'password maximum can have 20 characters')
})

export const SignInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, 'password must be at least 6 characters').max(20, 'password maximum can have 20 characters')
})

export const SignInWithOAuthSchema = z.object({
    provider: z.enum(["google", "discord"]),
    providerAccountId: z
        .string()
        .min(1, { message: "Provider Account ID is required." }),
    user: z.object({
        username: z
            .string()
            .min(3, { message: "Username must be at least 3 characters long." }),
        email: z
            .string()
            .email({ message: "Please provide a valid email address." }),
        image: z.string().url("Invalid image URL").optional(),
    }),
});

export const UserSchema = z.object({
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters long." }),
    email: z.string().email({ message: "Please provide a valid email address." }),
    image: z.string().url({ message: "Please provide a valid URL." }).optional(),
});

export const AccountSchema = z.object({
    userId: z.string().min(1, { message: "User ID is required." }),
    name: z.string().min(1, { message: "Name is required." }),
    image: z.string().url({ message: "Please provide a valid URL." }).optional(),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long." })
        .max(100, { message: "Password cannot exceed 100 characters." })
        .regex(/[A-Z]/, {
            message: "Password must contain at least one uppercase letter.",
        })
        .regex(/[a-z]/, {
            message: "Password must contain at least one lowercase letter.",
        })
        .regex(/[0-9]/, { message: "Password must contain at least one number." })
        .regex(/[^a-zA-Z0-9]/, {
            message: "Password must contain at least one special character.",
        })
        .optional(),
    provider: z.string().min(1, { message: "Provider is required." }),
    providerAccountId: z
        .string()
        .min(1, { message: "Provider Account ID is required." }),
});

export const LobbySchema = z.object({
    name: z.string().min(1, { message: "Name is required." }).max(20, { message: "20 character is maximum." }),
    password: z
        .union([
            z.string().length(0),
            z.string().min(6).max(20),
        ])
        .optional(),
    scenario: z.string(),
    maxPlayer: z.number().min(6, { message: 'Minimum 6 player per one lobby'}).max(12, { message: "Maximum 12 player per one lobby" }),
    isVisible: z.boolean(),
})

export const CardSchema = z.object({
    name: z.string().min(1, { message: "Card name is required." }).max(50, { message: "50 character is maximum." }),
    type: z.enum(["profession", "health", "phobia", "hobby", "luggage", "special", "bio", "additional"]),
    description: z.string().min(1, { message: 'Card description is required'}).max(250, { message: "Description must contain maximum 250 characters or less" }),
    level: z.number().min(1, { message: 'Minimum level is 1'}).max(5, { message: "Maximum level is 5" }),
    tags: z.array(z.object({
        name: z.string(),
        _id: z.string()
    }))
        .optional()
        .refine((tags) => tags === undefined || tags!.length <= 5, { message: 'Maximum 5 tag per one card' }),
    scenario: z.array(z.object({
        name: z.string(),
        checked: z.boolean(),
        _id: z.string()
    })).refine(
        (scenarios) => scenarios.some((item) => item.checked),
        { message: 'At least one scenario must be selected' }
    ),
})

export const UpdateCardSchema = CardSchema.extend({
    id: z.string().min(1, { message: "Card ID is required." }),
})

export const TagSchema = z.object({
    name: z.array(z.string().min(1, { message: "Tag name is required." }).max(15, { message: "15 character is maximum." })),
})


export const PasswordSchema = z.object({
        password: z.string().min(6).max(20)
})

export const ScenarioSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }).max(50, { message: "50 character is maximum." }),
    description: z.string().min(1, { message: 'Card description is required'}).max(2000, { message: "Description must contain maximum 2000 characters or less" }),
    winCondition: z.array(z.object({
        name: z.string(),
        _id: z.string()
    }))
        .optional()
        .refine((tags) => tags === undefined || tags!.length >= 2, { message: 'Minimum 2 tag for win' }),
    looseCondition: z.array(z.object({
        name: z.string(),
        _id: z.string()
    }))
        .optional()
        .refine((tags) => tags === undefined || tags!.length >= 2, { message: 'Minimum 2 tag for loose' }),
    isPublic: z.boolean().optional(),
    image: z.string().url({ message: "Please provide a valid URL." }).optional(),
})

export const PaginationSearchParamsSchema = z.object({
    page: z.number().int().positive().default(1),
    pageSize: z.number().int().positive().default(10),
    query: z.string().optional(),
    filter: z.string().optional(),
    sort: z.string().optional(),
    cardType: z.enum(["profession", "health", "phobia", "hobby", "luggage", "special", "bio", "additional", 'all']).optional(),
})