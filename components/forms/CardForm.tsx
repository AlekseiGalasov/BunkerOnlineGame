'use client'

import React from 'react';
import {useForm} from "react-hook-form";
import {z} from "zod";
import {CardSchema} from "@/lib/validations/validations";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from '../ui/dropdown-menu';
import {DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Badge} from "@/components/ui/badge";
import {toast} from "sonner";
import {createCard, editCard} from "@/lib/actions/card.action";
import Image from "next/image";

interface CardFormParams {
    defaultValues: CardParams
    formType: 'Create' | 'Edit'
    id?: string
    tags: TagParams[]
}


const CardForm = ({formType, defaultValues, id, tags}: CardFormParams) => {

    const form = useForm<z.infer<typeof CardSchema>>({
        resolver: zodResolver(CardSchema),
        defaultValues
    })

    const handleSubmit = async (data: CardParams) => {

        data.scenario = data.scenario.filter((elem: ScenarioParams) => elem.checked)

        let result
        if (formType === 'Edit') {
            result = await editCard({...data, id} as UpdateCardParams)
        }

        if (formType === 'Create') {
            result = await createCard(data)
        }

        if (result?.success) {
            toast(`Success`, {
                description: `Card ${result?.data?.name}  ${formType === 'Edit' ? 'edited' : 'created'} successfully`,
            })
            form.reset()
        } else {
            toast(`Error ${result?.status}`,{
                description: `Error ${result?.error?.message}`,
            })
        }
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
                                Card name
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
                                Describe the card
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type={'text'}
                                    {...field}
                                    className="no-focus min-h-12 rounded-1.5 border lg:w-2/3 xl:w-full"
                                />
                            </FormControl>
                            <FormDescription>
                                For example, if you have an unusual card, such as the Mage, describe what it can do and how it stands out from other cards.
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={'level'}
                    render={({field}) => (
                        <FormItem className="flex w-full flex-col gap-2.5">
                            <FormLabel className='text-toxic-green'>
                                Level (1 to 5)
                            </FormLabel>
                            <FormControl>
                                <Input
                                    onChange={event => field.onChange(+event.target.value)}
                                    defaultValue={form.getValues().level}
                                    required
                                    type={'number'}
                                    className="no-focus min-h-12 rounded-1.5 border lg:w-2/3 xl:w-full"
                                />
                            </FormControl>
                            <FormDescription>
                                Can be: 1 - lowest rating, 5 - highest rating. For example, for profession cards, 1 -
                                beginner, 5 - senior.
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={'type'}
                    render={({field}) => (
                        <FormItem className=''>
                            <FormLabel className='text-toxic-green'>Apocalypse scenario</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className="no-focus min-h-12 rounded-1.5 border w-full">
                                        <SelectValue placeholder="Select a apocalypse scenario"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="profession">profession</SelectItem>
                                    <SelectItem value="health">health</SelectItem>
                                    <SelectItem value="phobia">phobia</SelectItem>
                                    <SelectItem value="hobby">hobby</SelectItem>
                                    <SelectItem value="luggage">luggage</SelectItem>
                                    <SelectItem value="additional">additional</SelectItem>
                                    <SelectItem value="bio">bio</SelectItem>
                                    <SelectItem value="special">special</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={'tags'}
                    render={({field}) => (
                        <FormItem className=''>
                            <FormLabel className='text-toxic-green'>Tags</FormLabel>
                            <FormControl>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            className='cursor-pointer no-focus min-h-12 rounded-1.5 border w-full text-left'
                                            variant="outline">
                                            Select the tags that define the card
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-full">
                                        <DropdownMenuLabel>Tags</DropdownMenuLabel>
                                        <DropdownMenuSeparator/>
                                        {tags.map((tag, index) => (
                                            <DropdownMenuCheckboxItem
                                                key={index}
                                                checked={field.value ? field.value.some(elem => elem._id === tag._id) : false}
                                                defaultValue={tag._id}
                                                onCheckedChange={() => {
                                                    const selectedTags = field.value ? [...field.value] : [];
                                                    selectedTags.push(tag)
                                                    form.setValue('tags', selectedTags, {
                                                        shouldValidate: true,
                                                        shouldDirty: true,
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
                                {field.value ? Object.values(field.value)
                                    .map((elem, index) => (
                                        <Badge variant='secondary' className="gap-2 text-[14px]" key={index}>
                                            {elem.name}
                                            <Image
                                                src={'/icons/close.svg'}
                                                alt={'close icon'}
                                                width={12}
                                                height={12}
                                                className='cursor-pointer object-contain invert-0 dark:invert'
                                                onClick={() => {
                                                    const updatedValues = field.value.filter((_, i) => i !== index);
                                                    console.log(form.getValues('tags'), field.value)
                                                    form.setValue('tags', updatedValues.length ? updatedValues : [], {
                                                        shouldValidate: true,
                                                        shouldDirty: true,
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
                    name={'scenario'}
                    render={({field}) => (
                        <FormItem className=''>
                            <FormLabel className='text-toxic-green'>Suitable scenarios</FormLabel>
                            <FormControl>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button className='cursor-pointer no-focus min-h-12 rounded-1.5 border w-full text-left'
                                                variant="outline">
                                            {field.value.some((elem) => elem.checked) ? (
                                                <div className='flex flex-wrap gap-2 justify-start w-full'>
                                                    {field.value
                                                        .filter((elem) => elem.checked)
                                                        .map((elem) => (
                                                            <Badge variant='default' className="gap-4" key={elem._id}>
                                                                {elem.name}
                                                            </Badge>
                                                        ))}
                                                </div>
                                            ) : 'Select a scenario'}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-full">
                                        <DropdownMenuLabel>Scenarios</DropdownMenuLabel>
                                        <DropdownMenuSeparator/>
                                        {field.value.map((scenario, index) => (
                                            <DropdownMenuCheckboxItem
                                                key={scenario._id}
                                                checked={scenario.checked}
                                                defaultValue={scenario.name}
                                                onCheckedChange={(isChecked) => {
                                                    // Update the state immutably
                                                    const updatedScenarios = field.value.map((scn, idx) =>
                                                        idx === index
                                                            ? {...scn, checked: isChecked} // Update only the clicked item's `checked` field
                                                            : scn
                                                    );

                                                    // Notify React Hook Form about the value update
                                                    form.setValue('scenario', updatedScenarios, {
                                                        shouldValidate: true, // Optional: Trigger validation
                                                        shouldDirty: true, // Optional: Mark the field as "dirty"
                                                    });
                                                }}

                                            >
                                                {scenario.name}
                                            </DropdownMenuCheckboxItem>)
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </FormControl>
                            <FormDescription>
                                You can create new scenarios in {" "}
                                <Link className='text-yellow-300 hover:text-yellow-200 ' href="/scenarios/create">scenario
                                    creating page</Link>.
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
                    {formType} card
                </Button>
            </form>
        </Form>
    );
};

export default CardForm;