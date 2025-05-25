import React from 'react';
import {SubmitHandler, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {joinToLobby} from "@/lib/actions/lobby.action";
import {PasswordSchema} from "@/lib/validations/validations";
import {ActionResponse} from "@/types/global";

interface LobbyPasswordFormProps {
    commitPassword: (password: string) => Promise<ActionResponse>
}

const LobbyPasswordForm = ({commitPassword}: LobbyPasswordFormProps) => {

    const form = useForm<z.infer<typeof PasswordSchema>>({
        resolver: zodResolver(PasswordSchema),
        defaultValues: {
            password: ''
        },
    })

    const handleSubmit = async (data) => {
        await commitPassword(data.password);
    }

    return (
        <Form {...form}>
            <form action={form.handleSubmit(handleSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name={'password'}
                    render={({field}) => (
                        <FormItem className="flex w-full flex-col gap-2.5">
                            <FormLabel className="paragraph-medium text-dark-400_light700">
                                Enter the password
                            </FormLabel>
                            <FormControl>
                                <Input
                                    required
                                    type={'text'}
                                    {...field}
                                    className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-12 rounded-1.5 border"
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="cursor-pointer min-h-12 w-full rounded-2 px-4 py-3 font-inter !text-light-900"
                >
                    {form.formState.isSubmitting ? 'Entering the lobby...' : 'Enter the lobby'}
                </Button>
            </form>
        </Form>
    );
};

export default LobbyPasswordForm;