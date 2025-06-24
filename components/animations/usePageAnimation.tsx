'use client'
import gsap from 'gsap';
import {useState} from 'react';
import {useRouter} from "next/navigation";

const UsePageAnimation = () => {
    const [isAnimating, setIsAnimating] = useState(false)
    const router = useRouter();

    const handleNavigation = (url: string) => {
        if (isAnimating) return; // Prevent duplicate clicks
        setIsAnimating(true);

        gsap.fromTo('.leftSide', {width: 0}, {width: '50%', duration: 1.5, ease: "bounce.out"})
        gsap.fromTo('.rightSide', {width: 0}, {width: '50%', duration: 1.5,ease: "bounce.out", onComplete: () => {
                router.push(url);
                setIsAnimating(false);
        }})
    };

    return [handleNavigation]
};

export default UsePageAnimation;