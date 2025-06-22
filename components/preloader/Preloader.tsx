import React from 'react';
import Image from "next/image";

const Preloader = () => {
    return (
        <div className="mt-16 flex w-full flex-col items-center justify-center sm:mt-36">
            <Image
                className='object-contain animate-pulse'
                width={160}
                height={160}
                src={'/icons/radiation.svg'}
                alt={'preloader icon'}
            />
            <span className='text-[24px] font-bold leading-[31.2px] text-foreground mt-6'>Loading</span>
        </div>
    );
};

export default Preloader;