import React from 'react';
import Image from "next/image";
import Link from 'next/link';
import {Button} from "@/components/ui/button";

interface ErrorRendererProps {
    error?: {
        message: string;
        details?: Record<string, string[]>;
    } | undefined | null;
    empty?: {
        title: string
        message: string
    }
    button?: {
        text: string
        href: string
    }
}

interface StateSkeletonProps {
    image: {
        light: string
        dark: string
        alt: string
    }
    title: string
    message: string
    button?: {
        text: string
        href: string
    }
}

const ErrorSkeleton = ({button, image, title, message}: StateSkeletonProps) => {

    return (
        <div className="mt-16 flex w-full flex-col items-center justify-center sm:mt-36">
            <>
                <Image
                    src={image.dark}
                    alt={image.alt}
                    width={200}
                    height={200}
                    className="hidden object-contain dark:block"
                />
                <Image
                    src={image.light}
                    alt={image.alt}
                    width={200}
                    height={200}
                    className="block object-contain dark:hidden"
                />
            </>
            <h2 className="text-[24px] font-bold leading-[31.2px] text-foreground mt-6">{title}</h2>
            <p className="body-regular text-dark500_light700 my-3.5 max-w-md text-center">
                {message}
            </p>
            {button && (
                <Link href={button.href}>
                    <Button
                        className="cursor-pointer min-h-12 w-full rounded-2 px-4 py-3 font-inter !text-light-900">
                        {button.text}
                    </Button>
                </Link>
            )}
        </div>
    );
};

const ErrorRenderer = (props: ErrorRendererProps) => {

    const {button, empty, error} = props

    if (error) {
        return (
            <ErrorSkeleton
                image={{
                    light: "/icons/light-error.svg",
                    dark: "/icons/dark-error.svg",
                    alt: "Error state illustration",
                }}
                title={error.message}
                message={JSON.stringify(error.details, null, 2)}
                button={button}
            />
        )
    }

    if (empty) {
        return (
            <ErrorSkeleton
                image={{
                    light: "/icons/light-error.svg",
                    dark: "/icons/dark-error.svg",
                    alt: "Empty state illustration",
                }}
                title={empty.title}
                message={empty.message}
                button={button}
            />
        )
    }

    return null
};

export default ErrorRenderer;