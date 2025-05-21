'use client'

import React from 'react';
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {ROUTES} from "@/constants/route";
import {signIn} from "next-auth/react";

const SocialAuthForm = () => {

    const handleSignIn = async (provider: 'google' | 'discord') => {
        try {
            await signIn(provider, {
                redirectTo: ROUTES.HOME,
                redirect: true
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
            <div className='flex flex-wrap gap-2.5'>
                <Button
                    onClick={() => handleSignIn('google')}
                    className='cursor-pointer rounded-2 min-h-12 flex-1 px-4 py-3'
                    variant={"secondary"}
                >
                    <Image
                        src={'/icons/google-icon.svg'}
                        alt='google icon'
                        width='20'
                        height='20'
                    />
                    <span>Log in with Google</span>
                </Button>
                <Button
                    onClick={() => handleSignIn('discord')}
                    className='cursor-pointer rounded-2 min-h-12 flex-1 px-4 py-3'
                    variant={"secondary"}
                >
                    <Image
                        src={'/icons/discord-icon.svg'}
                        alt='google icon'
                        width='20'
                        height='20'/>
                    <span>Log in with Discord</span>
                </Button>
            </div>
    );
};

export default SocialAuthForm;