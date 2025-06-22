import React from 'react';
import CreateCardForm from "@/components/forms/CreateCardForm";

const Page = () => {
    return (
        <div className='flex flex-col items-center gap-4'>
            <div className='flex flex-row items-center gap-4'>
                <span className='text-3xl'>🎮</span>
                <h2 className='font-rubik-dirt text-2xl primary-text-gradient'>Creating a game card</h2>
            </div>
            <span className='text-1xl primary-text-gradient'>Creating new cards will help make the gaming experience more unique, will help to better immerse yourself in each adventure due to the individuality of the cards for a specific scenario.</span>
            <div className='flex flex-col border-2 rounded-2xl shadow-lg py-10 px-6 w-1/2'>
                <CreateCardForm />
            </div>
        </div>
    );
};

export default Page;