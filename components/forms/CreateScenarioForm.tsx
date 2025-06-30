'use client'

import React from 'react';
import {z} from "zod";
import {useForm} from "react-hook-form";
import {ScenarioSchema} from "@/lib/validations/validations";
import {zodResolver} from "@hookform/resolvers/zod";
import {createCard} from "@/lib/actions/card.action";
import {toast} from "sonner";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Checkbox} from "@/components/ui/checkbox";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import Link from "next/link";
import {
    DropdownMenu, DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Badge} from "@/components/ui/badge";
import Image from "next/image";

type Tag = {
    _id: string,
    name: string
}

interface ScenarioFormProps {
    tags: Tag[]
}

const CreateScenarioForm = ({tags}: ScenarioFormProps) => {

    const defaultTags = tags.map((tag: Tag) => ({...tag, checked: false}));

    const form = useForm<z.infer<typeof ScenarioSchema>>({
        resolver: zodResolver(ScenarioSchema),
        defaultValues: {
            name: '',
            description: '',
            winCondition: undefined,
            looseCondition: undefined,
            isPublic: true,
            image: ''
        },
    })

    const handleSubmit = async (data: CreateScenarioParams) => {

        toast(`Success`, {
            description: JSON.stringify(data),
        })

        // if (result?.success) {
        //     toast(`Success`, {
        //         description: `Card ${result.data.name} created successfully`,
        //     })
        //     form.reset()
        // } else {
        //     toast(`Error ${result.status}`, {
        //         description: `Error ${result.error?.message}`,
        //     })
        // }
    }

    return (
        <Form {...form}>
            <form action={form.handleSubmit(handleSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name={'name'}
                    render={({field}) => (
                        <FormItem className="flex w-full flex-col gap-2.5">
                            <FormLabel className='text-toxic-green'>
                                Scenario Title
                            </FormLabel>
                            <FormControl>
                                <Input
                                    required
                                    type={'text'}
                                    {...field}
                                    className="no-focus min-h-12 rounded-1.5 border lg:w-2/3 xl:w-full"
                                />
                            </FormControl>
                            <FormDescription>
                                A short, clear, and memorable name that reflects the core idea of the scenario. This
                                will be visible to players when selecting a scenario.
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={'description'}
                    render={({field}) => (
                        <FormItem className="flex w-full flex-col gap-2.5">
                            <FormLabel className='text-toxic-green'>
                                Scenario Description
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    className="no-focus min-h-12 rounded-1.5 border lg:w-2/3 xl:w-full"
                                />
                            </FormControl>
                            <FormDescription>
                                A detailed explanation of the events leading up to the bunker situation. Describe the
                                world conditions, threats, available resources, and specific victory (or defeat)
                                conditions players must meet.
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={'winCondition'}
                    render={({field}) => (
                        <FormItem className=''>
                            <FormLabel className='text-toxic-green'>Victory Tags</FormLabel>
                            <FormControl>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            className='cursor-pointer no-focus min-h-12 rounded-1.5 border w-full text-left'
                                            variant="outline">
                                            Select the tags that define the scenario as a success
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-full">
                                        <DropdownMenuLabel>Defeat Tags</DropdownMenuLabel>
                                        <DropdownMenuSeparator/>
                                        {defaultTags.map((tag, index) => (
                                            <DropdownMenuCheckboxItem
                                                key={index}
                                                checked={field.value ? [...field.value].includes(tag.name) : false}
                                                defaultValue={tag.name}
                                                onCheckedChange={() => {
                                                    const selectedTags = field.value ? [...field.value] : [];
                                                    selectedTags.push(tag.name)
                                                    form.setValue('winCondition', selectedTags, {
                                                        shouldValidate: true, // Optional: Trigger validation
                                                        shouldDirty: true, // Optional: Mark the field as "dirty"
                                                    });
                                                }}
                                            >
                                                {tag.name}
                                            </DropdownMenuCheckboxItem>)
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </FormControl>
                            <div className='flex flex-wrap gap-2 justify-start w-full'>
                                {field.value ? field.value
                                    .map((elem, index) => (
                                        <Badge variant='secondary' className="gap-2 text-[14px]" key={index}>
                                            {elem}
                                            <Image
                                                src={'/icons/close.svg'}
                                                alt={'close icon'}
                                                width={12}
                                                height={12}
                                                className='cursor-pointer object-contain invert-0 dark:invert'
                                                onClick={() => {
                                                    const updatedValues = field.value.filter((_, i) => i !== index);
                                                    form.setValue('winCondition', updatedValues.length ? updatedValues : undefined, {
                                                        shouldValidate: true, // Optional: Trigger validation
                                                        shouldDirty: true, // Optional: Mark the field as "dirty"
                                                    });
                                                }}
                                            />
                                        </Badge>
                                    )) : null}
                            </div>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={'looseCondition'}
                    render={({field}) => (
                        <FormItem className=''>
                            <FormLabel className='text-toxic-green'>Defeat Tags</FormLabel>
                            <FormControl>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            className='cursor-pointer no-focus min-h-12 rounded-1.5 border w-full text-left'
                                            variant="outline">
                                            Select the tags that define the scenario as a failure
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-full">
                                        <DropdownMenuLabel>Defeat Tags</DropdownMenuLabel>
                                        <DropdownMenuSeparator/>
                                        {defaultTags.map((tag, index) => (
                                            <DropdownMenuCheckboxItem
                                                key={index}
                                                checked={field.value ? [...field.value].includes(tag.name) : false}
                                                defaultValue={tag.name}
                                                onCheckedChange={() => {
                                                    const selectedTags =  field.value ? [...field.value] : [];
                                                    selectedTags.push(tag.name)
                                                    form.setValue('looseCondition', selectedTags, {
                                                        shouldValidate: true, // Optional: Trigger validation
                                                        shouldDirty: true, // Optional: Mark the field as "dirty"
                                                    });
                                                }}
                                            >
                                                {tag.name}
                                            </DropdownMenuCheckboxItem>)
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </FormControl>
                            <div className='flex flex-wrap gap-2 justify-start w-full'>
                                {field.value ? field.value
                                    .map((elem, index) => (
                                        <Badge variant='secondary' className="gap-2 text-[14px]" key={index}>
                                            {elem}
                                            <Image
                                                src={'/icons/close.svg'}
                                                alt={'close icon'}
                                                width={12}
                                                height={12}
                                                className='cursor-pointer object-contain invert-0 dark:invert'
                                                onClick={() => {
                                                    const updatedValues = field.value.filter((_, i) => i !== index);
                                                    form.setValue('looseCondition', updatedValues.length ? updatedValues : undefined, {
                                                        shouldValidate: true, // Optional: Trigger validation
                                                        shouldDirty: true, // Optional: Mark the field as "dirty"
                                                    });
                                                }}
                                            />
                                        </Badge>
                                    )) : null}
                            </div>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={'isPublic'}
                    render={({field}) => (
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
                                    Make Scenario Public
                                </FormLabel>
                                <FormDescription>
                                    If checked, this scenario will be visible to other players in the public list.
                                    Uncheck it to keep the scenario private and available only to you.
                                </FormDescription>
                            </div>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={'image'}
                    render={({field}) => (
                        <FormItem className="flex w-full flex-col gap-2.5">
                            <FormLabel className='text-toxic-green'>
                                Scenario Image
                            </FormLabel>
                            <FormControl>
                                <Input
                                    required
                                    type={'text'}
                                    {...field}
                                    className="no-focus min-h-12 rounded-1.5 border lg:w-2/3 xl:w-full"
                                />
                            </FormControl>
                            <FormDescription>
                                Add an image that visually represents the scenario's theme or atmosphere. It will be
                                shown during scenario selection.
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="cursor-pointer min-h-12 w-full rounded-2 px-4 py-3 bg-radiation-yellow"
                >
                    Create Scenario
                </Button>
            </form>
        </Form>
    );
};

export default CreateScenarioForm;