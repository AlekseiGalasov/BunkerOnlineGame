import React from 'react';
import CreateLobbyForm from "@/components/forms/CreateLobbyForm";
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import {ROUTES} from "@/constants/route";

const CreateLobbyPage = async () => {

    const session = await auth()

    if (!session) return redirect(ROUTES.SIGN_IN);

    return (
        <div className='flex flex-col items-center gap-4'>
            <div className='flex flex-row items-center gap-4'>
                <span className='text-3xl'>🚪</span>
                <h2 className='font-rubik-dirt text-2xl primary-text-gradient'>Create Bunker</h2>
            </div>
            <span className='text-1xl primary-text-gradient'>Set up a shelter before a disaster</span>
            <div className='flex flex-col border-2 rounded-2xl shadow-lg py-10 px-6 w-1/2'>
                <CreateLobbyForm />
            </div>
        </div>
    );
};

export default CreateLobbyPage;