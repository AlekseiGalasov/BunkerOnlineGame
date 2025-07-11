'use client'

import React from 'react';
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {LobbySchema} from "@/lib/validations/validations";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {SelectContent, SelectItem, Select, SelectTrigger, SelectValue} from '@/components/ui/select';
import Link from "next/link";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {createLobby} from "@/lib/actions/lobby.action";
import {ROUTES} from "@/constants/route";

const CreateLobbyForm = ({scenarios}: {scenarios: {_id: string, name: string}[]}) => {

    const router = useRouter()
    const form = useForm<z.infer<typeof LobbySchema>>({
        resolver: zodResolver(LobbySchema),
        defaultValues: {
            name: '',
            password: '',
            scenario: '',
            maxPlayer: 6,
            isVisible: true
        },
    })

    const handleSubmit = async (data: LobbyParams) => {

        console.log(data)

        const result = await createLobby(data)


        if (result?.success) {
            toast(`Success`, {
                description: JSON.stringify(data),
            })
            router.push(ROUTES.LOBBY(result?.data?._id))
        } else {
            toast(`Error ${result.status}`,{
                description: `Error ${result.error?.message}`,
            })
        }
    }

    return (
        <Form {...form}>
            <form action={form.handleSubmit(handleSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name={'name'}
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col gap-2.5">
                            <FormLabel className='text-toxic-green'>
                                Name of the shelter
                            </FormLabel>
                            <FormControl>
                                <Input
                                    required
                                    type={'text'}
                                    {...field}
                                    className="no-focus min-h-12 rounded-1.5 border lg:w-2/3 xl:w-1/2"
                                />
                            </FormControl>
                            <FormDescription>
                                Visible to all players. Numbers and symbols can be used.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={'password'}
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col gap-2.5">
                            <FormLabel className='text-toxic-green'>
                                Access code
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type={'text'}
                                    {...field}
                                    className="no-focus min-h-12 rounded-1.5 border lg:w-2/3 xl:w-1/2"
                                />
                            </FormControl>
                            <FormDescription>
                                Only those who know the code will be able to enter.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={'maxPlayer'}
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col gap-2.5">
                            <FormLabel className='text-toxic-green'>
                                Contenders for survival
                            </FormLabel>
                            <FormControl>
                                <Input
                                    onChange={event => field.onChange(+event.target.value)}
                                    defaultValue={form.getValues().maxPlayer}
                                    required
                                    type={'number'}
                                    className="no-focus min-h-12 rounded-1.5 border lg:w-2/3 xl:w-1/2"
                                />
                            </FormControl>
                            <FormDescription>
                                Minimum can be 6 survivals, maximum 12.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={'scenario'}
                    render={({ field }) => (
                        <FormItem className=''>
                            <FormLabel className='text-toxic-green'>Apocalypse scenario</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className="no-focus min-h-12 rounded-1.5 border w-full" >
                                        <SelectValue placeholder="Select a apocalypse scenario" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {
                                        Object.values(scenarios).map(scenario => (
                                            <SelectItem key={scenario._id} value={scenario._id}>{scenario.name}</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                You can create new scenarios in {" "}
                                <Link className='text-yellow-300 hover:text-yellow-200 ' href="/scenarios/create">scenario creating page</Link>.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={'isVisible'}
                    render={({ field }) => (
                        <FormItem className='flex flex-row items-start space-y-0 '>
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={() => {
                                            field.onChange(!field.value);
                                        }}
                                    />
                                </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    Visible in the list of open lobbies
                                </FormLabel>
                                <FormDescription>
                                    If you turn it off, you can only log in via a direct link.
                                </FormDescription>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="cursor-pointer min-h-12 w-full rounded-2 px-4 py-3 bg-radiation-yellow"
                >
                    🛡️ Start survive
                </Button>
            </form>
        </Form>
    );
};

export default CreateLobbyForm;