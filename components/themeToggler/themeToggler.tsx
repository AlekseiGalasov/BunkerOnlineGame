'use client'

import React from 'react';
import {useTheme} from "next-themes";

const ThemeToggler = () => {

    const {theme, setTheme} = useTheme()

    return (
        <div className="flex gap-1.5 items-center">
            <p className={theme === 'light' ? 'font-bold' : ''}>Light</p>
            <label className=" cursor-pointer bg-primary relative block w-[50] h-[30] rounded-4xl">
                <input onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')} type="checkbox" id="mode" className="hidden"/>
                <span className={`toggler ${theme === 'dark' ? 'right-0.5' : 'left-0.5'}`} />
            </label>
            <p className={theme === 'dark' ? 'font-bold' : ''}>Dark</p>
        </div>
    );
};

export default ThemeToggler;