import React from 'react';
import ErrorRenderer from "@/components/ErrorRenderer";
import LobbyRow from "@/components/lobby/LobbyRow";
import {getAllLobbies} from "@/lib/actions/lobby.action";
import {Pagination, PaginationContent, PaginationItem, PaginationLink} from '../ui/pagination';
import {Button} from "@/components/ui/button";
import {SearchParams} from "@/app/(root)/lobby/page";

const LobbyTable = async ({searchParams}: SearchParams) => {

    const {query, filter, page, pageSize} = await searchParams

    const {data, error} = await getAllLobbies({
        query: query || "",
        filter: filter || "",
        pageSize: Number(pageSize) || 10,
        page: Number(page) || 1,
    });

    const {lobbies, isNext} = data

    if (error) {
        return <ErrorRenderer error={{message: error?.message}}/>
    }

    if (!lobbies || lobbies.length === 0) {
        return <ErrorRenderer
            empty={{message: 'check filters maybe you are type wrong name', title: 'Lobby not found'}}/>
    }

    return (
        <section className='flex w-full flex-col gap-2'>
            <h2 className='font-rubik-dirt text-2xl primary-text-gradient w-full text-center'>Lobbies</h2>
            <div className='flex gap-4 px-6 py-2'>
                <div className='font-rubik-dirt text-xl text-toxic-green w-full'>NAME</div>
                <div className='font-rubik-dirt text-xl text-toxic-green w-1/5'>STATUS</div>
                <div className='font-rubik-dirt text-xl text-toxic-green w-2/5'>SCENARIO</div>
                <div className='font-rubik-dirt text-xl text-toxic-green w-1/5'>PLAYERS</div>
                <div className='font-rubik-dirt text-xl text-toxic-green w-1/5'>PASSWORD</div>
            </div>
            {lobbies.length && lobbies.map((lobby: Lobby) => (
                <LobbyRow key={lobby._id} lobby={lobby}/>
            ))}
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <Button className='cursor-pointer'>Prev page</Button>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <Button className='cursor-pointer' disabled={isNext}>Next page</Button>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </section>
    );
};

export default LobbyTable;