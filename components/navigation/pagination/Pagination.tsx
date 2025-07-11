'use client'

import React from 'react';
import {PaginationContent, PaginationItem, PaginationLink, Pagination} from "@/components/ui/pagination";
import {Button} from "@/components/ui/button";
import {useRouter, useSearchParams} from "next/navigation";
import {formUrlQuery} from "@/lib/url";
import {cn} from "@/lib/utils";

interface PaginationComponentProps {
    totalPages: number;
}

const PaginationComponent = ({totalPages}: PaginationComponentProps) => {

    const searchParams = useSearchParams()
    const currentPage = Number(searchParams.get('page')) || 1
    const router = useRouter()

    const changePageHandler = (page: number) => {
        const newUrl = formUrlQuery({
            params: searchParams.toString(),
            value: page,
            key: 'page'
        })
        router.push(newUrl, {scroll: false})
    }

    const nextPageHandler = () => {
        const newUrl = formUrlQuery({
            params: searchParams.toString(),
            value: (currentPage + 1).toString(),
            key: 'page'
        })
        router.push(newUrl, {scroll: false})
    }

    const prevPageHandler = () => {
        const newUrl = formUrlQuery({
            params: searchParams.toString(),
            value: (currentPage - 1).toString(),
            key: 'page'
        })
        router.push(newUrl, {scroll: false})
    }

    return (
        <Pagination>
            <PaginationContent className='flex justify-center gap-2'>
                <PaginationItem>
                    <Button disabled={currentPage <= 1} onClick={prevPageHandler} className='cursor-pointer'>Prev
                        page</Button>
                </PaginationItem>
                {
                    totalPages > 1 && new Array(totalPages).fill(0).map((item, index) => (
                        <PaginationItem key={index}>
                            <Button variant='ghost'
                                    className={cn(currentPage == index + 1 && 'bg-secondary', 'cursor-pointer')}
                                    onClick={() => changePageHandler(index + 1)}>{index + 1}</Button>
                        </PaginationItem>
                    ))
                }
                <PaginationItem>
                    <Button onClick={nextPageHandler} className='cursor-pointer' disabled={currentPage === totalPages}>Next
                        page</Button>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

export default PaginationComponent;