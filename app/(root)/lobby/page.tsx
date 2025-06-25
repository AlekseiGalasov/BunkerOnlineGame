import React from 'react';
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import {ROUTES} from "@/constants/route";
import LobbyTable from "@/components/lobby/LobbyTable";
import LobbySearch from "@/components/lobby/LobbySearch";
import {getAllLobbies} from "@/lib/actions/lobby.action";

export interface SearchParams {
    searchParams: Promise<{ [key: string]: string }>
}

const LobbyPage = async ({searchParams}: SearchParams) => {

    const session = await auth()
    const {query, filter, page, pageSize} = await searchParams

    if (!session) {
        redirect(ROUTES.SIGN_IN)
    }

    const {data, error, success} = await getAllLobbies({
        query: query || "",
        filter: filter || "",
        pageSize: Number(pageSize) || 5,
        page: Number(page) || 1,
    });

    return (
        <div className='flex flex-col items-center gap-4'>
            <div className='flex flex-row items-center gap-4'>
                <h2 className='font-rubik-dirt text-2xl primary-text-gradient'>Choose the lobby</h2>
            </div>
            <div className='flex w-full gap-4'>
                <div className='flex flex-col border-2 rounded-2xl shadow-lg py-10 px-6 w-3/5'>
                    <LobbyTable data={data} error={error} success={success} />
                </div>
                <div className='border-2 rounded-2xl shadow-lg py-10 px-6 w-2/5'>
                    <LobbySearch searchParams={searchParams} />
                </div>
            </div>
        </div>
    );
};

export default LobbyPage;