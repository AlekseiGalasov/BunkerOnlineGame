import React from 'react';
import CreateTagForm from "@/components/forms/CreateTagForm";

const Page = () => {
    return (
        <div className='flex flex-col items-center gap-4'>
            <div className='flex flex-row items-center gap-4'>
                <span className='text-3xl'>🚪</span>
                <h2 className='font-rubik-dirt text-2xl primary-text-gradient'>Create Tags for Win or Loose</h2>
            </div>
            <div className='flex flex-col border-2 rounded-2xl shadow-lg py-10 px-6 w-1/2'>
                <CreateTagForm />
            </div>
        </div>
    );
};

export default Page;