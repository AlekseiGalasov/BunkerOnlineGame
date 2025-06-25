'use client'

import React from 'react';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage
} from '@/components/ui/breadcrumb';
import {usePathname} from "next/navigation";
import usePageAnimation from "@/components/animations/usePageAnimation";
import {Button} from "@/components/ui/button";
import {ROUTES} from "@/constants/route";


const BreadCumbers = () => {

    const pathname = usePathname();
    const [handleNavigation] = usePageAnimation()

    const pathArray: { route: string; name: string; }[] = []
    let newPath = ''
    pathname.split('/').forEach((elem, index) => {
        if (index !== 0) {
            newPath +=  '/' + elem
            pathArray.push({route: newPath, name: elem.charAt(0).toUpperCase() + elem.slice(1)})
        };
    });

    const handleClick = (route: string) => {
        if (route === pathname) {
            return
        }
        handleNavigation(route)
    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <Button className='cursor-pointer' variant='ghost' onClick={() => handleClick(ROUTES.HOME)}>Home</Button>
                </BreadcrumbItem>
                { (pathArray.length >= 1 && pathArray[0].name !== '') && pathArray.map(elem => (
                        <React.Fragment key={elem.route}>
                            <BreadcrumbSeparator/>
                            <BreadcrumbItem>
                                <Button className='cursor-pointer' variant='ghost' onClick={() => handleClick(elem.route)}>{elem.name}</Button>
                            </BreadcrumbItem>
                        </React.Fragment>
                    ))
                }
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default BreadCumbers;