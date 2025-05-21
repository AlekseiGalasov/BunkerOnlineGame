'use client'

import React from 'react';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {DefaultValues, FieldValues, Path, SubmitHandler, useForm} from "react-hook-form";
import {z, ZodType} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {ROUTES} from "@/constants/route";
import { Input } from '../ui/input';
import {ActionResponse} from "@/types/global";
import { toast } from "sonner"
import {useRouter} from "next/navigation";

interface AuthFormProps<T extends FieldValues> {
    defaultValues: T,
    formType: 'SIGN_IN' | 'SIGN_UP',
    schema: ZodType<T>
    onSubmit: (data: T) => Promise<ActionResponse>
}

const AuthForm = <T extends FieldValues>({schema, formType, defaultValues, onSubmit}: AuthFormProps<T>) => {

    const router = useRouter()
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as DefaultValues<T>,
    })

    const handleSubmit: SubmitHandler<T> = async (data) => {
        const result = await onSubmit(data) as ActionResponse

        if (result?.success) {
            toast(`Success`, {
                description: formType === 'SIGN_UP' ? 'Signed in successfully' : 'Signed up successfully' ,
            })
            router.push(ROUTES.HOME)
        } else {
            toast(`Error ${result.status}`,{
                description: `Error ${result.error?.message}`,
            })
        }
    }

    const buttonText = formType === 'SIGN_IN' ? 'Sign in' : 'Sign up'

    return (
        <Form {...form}>
        <form action={form.handleSubmit(handleSubmit)} className="space-y-8" >
            {
                Object.keys(defaultValues).map((field) => (
                    <FormField
                        key={field}
                        control={form.control}
                        name={field as Path<T>}
                        render={({ field }) => (
                            <FormItem className="flex w-full flex-col gap-2.5">
                                <FormLabel className="paragraph-medium text-dark-400_light700">
                                    {field.name === 'email' ? 'Email Address' : field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        required
                                        type={field.name === 'password' ? 'password' : 'text'}
                                        placeholder={defaultValues[field.name]}
                                        {...field}
                                        className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-12 rounded-1.5 border"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ))
            }
            <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="cursor-pointer min-h-12 w-full rounded-2 px-4 py-3 font-inter !text-light-900"
            >
                {form.formState.isSubmitting ? buttonText === 'Sign in' ? 'Signing in...' : 'Signing up...' : buttonText }
            </Button>
            { formType === "SIGN_IN" ?
                <p>Don&#39;t have an account? {' '} <Link className="text-chart-3" href={ROUTES.SIGN_UP}>Sign up!</Link></p>
                :
                <p>Already have an account? {' '} <Link className="text-chart-3" href={ROUTES.SIGN_IN}>Sign in!</Link></p>
            }
        </form>
        </Form>
    );
};

export default AuthForm;