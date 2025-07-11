'use client'

import React from 'react';
import {useForm} from "react-hook-form";
import {z} from "zod";
import {TagSchema} from "@/lib/validations/validations";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {Badge} from "@/components/ui/badge";
import Image from "next/image";
import {createTags} from "@/lib/actions/tag.action";


const CreateTagForm = () => {

    const form = useForm<z.infer<typeof TagSchema>>({
        resolver: zodResolver(TagSchema),
        defaultValues: {
            name: [],
        },
    })

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: { value: string[] }) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            const tagInput = e.currentTarget.value.trim()
            if (tagInput && tagInput.length < 15 && !field.value.includes(tagInput)) {
                form.setValue("name", [...field.value, tagInput])
                e.currentTarget.value = ''
                form.clearErrors('name')
            } else if (tagInput.length > 15) {
                form.setError("name", {
                    type: 'manual',
                    message: 'Tag should be less than 15 characters'
                })
            } else if (field.value.includes(tagInput)) {
                form.setError("name", {
                    type: 'manual',
                    message: 'Tag already exist'
                })
            }
        }
    }

    const handleTagRemove = (tag: string, field: { value: string[] }) => {
        const newTags = field.value.filter((t) => t !== tag)
        form.setValue('name', newTags)
        if (!newTags.length) {
            form.setError("name", {
                type: 'manual',
                message: 'Tags are required'
            })
        }
    }

    const handleSubmit = async (data: TagParams) => {

        const result = await createTags(data)

        if (result?.success) {
            toast(`Success`, {
                description: `Tag/s created successfully`,
            })
            form.reset()
        } else {
            toast(`Error ${result.status}`, {
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
                    render={({field}) => (
                        <FormItem className="flex w-full flex-col gap-2.5">
                            <FormLabel className='text-toxic-green'>
                                Tag name
                            </FormLabel>
                            <FormControl>
                                <div>
                                    <Input
                                        type={'text'}
                                        className="no-focus min-h-12 rounded-1.5 border lg:w-2/3 xl:w-full"
                                        onKeyDown={(e) => handleInputKeyDown(e, field)}
                                    />
                                    {
                                        field?.value?.length > 0 && (
                                            <div className='flex flex-start mt-2.5 flex-wrap gap-2.5'>
                                                {field?.value?.map((tag: string, index: number) =>
                                                    <Badge
                                                        variant='secondary'
                                                        className='cursor-pointer gap-2 py-1 px-2'
                                                        key={index}
                                                        onClick={() => handleTagRemove(tag, field)}
                                                    >
                                                        {tag}
                                                        <Image
                                                            src={'/icons/close.svg'}
                                                            alt={'close icon'}
                                                            width={12}
                                                            height={12}
                                                            className='cursor-pointer object-contain invert-0 dark:invert'
                                                        />
                                                    </Badge>
                                                )}
                                            </div>
                                        )
                                    }
                                </div>
                            </FormControl>
                            <FormDescription>
                                You can add a few tags to your scenario in order to make it easier to find it later.<b>Type the tag name and press Enter.</b>
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
                    Create tags
                </Button>
            </form>
        </Form>
    );
};

export default CreateTagForm;