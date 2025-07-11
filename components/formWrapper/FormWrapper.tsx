import React from 'react';

interface FormWrapperProps {
    header?: string
    headerImage?: string
    text?: string
    children: React.ReactNode
}

const FormWrapper = ({header, headerImage, text, children}: FormWrapperProps) => {
    return (
        <div className='flex flex-col items-center gap-4'>
            <div className='flex flex-row items-center gap-4'>
                {headerImage ? <span className='text-3xl'>{headerImage}</span> : null}
                { header ? <h2 className='font-rubik-dirt text-2xl primary-text-gradient'>{header}</h2> : null }
            </div>
            { text ? <span className='text-1xl primary-text-gradient'>{text}</span> : null}
            <div className='flex flex-col border-2 rounded-2xl shadow-lg py-10 px-6 w-1/2'>
                { children}
            </div>
        </div>
    );
};

export default FormWrapper;