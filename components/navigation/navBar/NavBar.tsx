import React from 'react';
import ThemeToggler from "@/components/themeToggler/themeToggler";
import {Button} from "@/components/ui/button";
import {LogOut} from 'lucide-react';
import {auth, signOut} from "@/auth";
import {ROUTES} from "@/constants/route";
import Link from "next/link";

const NavBar = async () => {

    const session = await auth()
    const userId = session?.user?.id

    return (
        <section className='w-full bg-sidebar flex justify-center'>
            <nav className='max-w-[1920px] w-full flex justify-between fixed z-40 min-h-[46px] bg-sidebar py-4 px-10 items-center '>
                <Link href={ROUTES.HOME}>
                    <h1 className='font-rubik-dirt text-2xl primary-text-gradient'>BunkerPetProject</h1>
                </Link>
                <div className='flex gap-4'>
                    <ThemeToggler/>
                    {userId ? <form className='flex flex-col' action={async () => {
                            'use server'
                            await signOut({redirectTo: ROUTES.SIGN_UP})
                        }}>
                            <Button variant="link" type='submit'
                                    className='sursor-pointer base-medium w-fit bg-transparent px-4 py-3'>
                                <LogOut
                                    className='size-5 text-black dark:text-white'
                                />
                                <span className="max-lg:hidden text-dark300_light900">Logout</span>
                            </Button>
                        </form> :
                        <div className='flex gap-4'>
                            <Button variant='outline' asChild
                                    className="font-rubik-dirt btn-secondary min-h-[41px] rounded-lg px-4 py-3 shadow-none">
                                <Link href={ROUTES.SIGN_IN}>
                                    <span>Log In</span>
                                </Link>
                            </Button>
                            <Button variant='secondary' asChild
                                    className="font-rubik-dirt min-h-[41px] rounded-lg px-4 py-3 shadow-none">
                                <Link href={ROUTES.SIGN_UP}>
                                    <span>Sign up</span>
                                </Link>
                            </Button>
                        </div>
                    }
                </div>
            </nav>
        </section>
    );
};

export default NavBar;