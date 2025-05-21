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