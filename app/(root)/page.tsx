import React from 'react';
import {auth} from "@/auth";

const HomePage = async () => {

    const session = await auth()

    return (
        <div>
            <span className='p-10 text-radiation-yellow'>HomePage</span>
            <span className='p-10 text-toxic-green'>HomePage</span>
            <span className='p-10 primary-text-gradient'>HomePage</span>
        </div>
    );
};

export default HomePage;