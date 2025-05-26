import React from 'react';

const Preloader = () => {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="text-[80px] leading-[80px] animate-pulse primary-text-gradient">☢</div>
            <span className='font-rubik-dirt primary-text-gradient text-xl'>Loading</span>
        </div>
    );
};

export default Preloader;