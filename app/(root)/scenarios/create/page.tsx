import React from 'react';
import CreateScenarioForm from "@/components/forms/CreateScenarioForm";
import CreateLobbyForm from "@/components/forms/CreateLobbyForm";
import {getAllTags} from "@/lib/actions/tag.action";

const CreateScenarioPage = async () => {

    const {data, success} = await getAllTags({
        pageSize: 10,
        page: 1,
    })

    const {totalPages, tags, isNext} = data

    return (
        <div className='flex flex-col items-center gap-4'>
            <div className='flex flex-row items-center gap-4'>
                <span className='text-3xl'>🚪</span>
                <h2 className='font-rubik-dirt text-2xl primary-text-gradient'>Create Scenario for your bunker</h2>
            </div>
            <div className='flex flex-col border-2 rounded-2xl shadow-lg py-10 px-6 w-1/2'>
                <CreateScenarioForm tags={tags} />
            </div>
        </div>
    );
};

export default CreateScenarioPage;