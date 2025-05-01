import React, { useRef, useEffect } from 'react';
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HorizontalScrolling = () => {
    const sideScrollRef = useRef(null);
    const textRef = useRef(null);
    const horizontalSectionRef = useRef(null);

    useGSAP(() => {
        let horizontalScroll;
        ScrollTrigger.matchMedia({
            "(min-width: 768px)": () => {
                horizontalScroll = gsap.to(textRef.current, {
                    x: () => -(textRef.current.scrollWidth - document.documentElement.clientWidth + 1390),
                    ease: "none",
                    scrollTrigger: {
                        trigger: horizontalSectionRef.current,
                        start: "top top",
                        end: () => `+=${textRef.current.scrollWidth - document.documentElement.clientWidth}`,
                        scrub: 1,
                        pin: true,
                        anticipatePin: 1,
                        invalidateOnRefresh: true
                    }
                });
            }
        });

        gsap.to(".animate-float", {
            y: -15,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        gsap.to(".animate-hit", {
            rotation: 0,
            duration: 0.3,
            scrollTrigger: {
                trigger: textRef.current,
                start: "left center",
                end: "right center",
                scrub: true,
                onEnter: () => {
                    gsap.to(".animate-hit", {
                        rotation: 45,
                        duration: 0.2,
                        yoyo: true,
                        repeat: 1
                    });
                }
            }
        });

        // Gradient animation
        gsap.to(".gradient-text", {
            backgroundPosition: "100% 50%",
            duration: 10,
            scrollTrigger: {
                trigger: horizontalSectionRef.current,
                start: "top center",
                end: "+=300%",
                scrub: 1
            }
        });

    }, []);

    return (
        <div ref={horizontalSectionRef} className="h-screen bg-gradient-to-b from-[#e2e8f0] to-[#cbd5e1] relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBvcGFjaXR5PSIwLjEiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzAwMCIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]"></div>
            </div>

            <div ref={sideScrollRef} className="h-full flex items-center overflow-hidden">
                <div 
                    ref={textRef} 
                    className="relative translate-x-[120vw] text-[9vmax] md:text-[16vmax] whitespace-nowrap pl-8 flex items-center h-full"
                >
                    <div className="flex items-center space-x-6">
                        <span className="font-bold text-gray-600 opacity-90 tracking-tight">NO MORE</span>

                        <div className="relative inline-block">
                            <span className="font-extrabold gradient-text bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-[length:200%_auto]">
                                STARING AT SPREADSHEETS
                            </span>
                            
                            <span className="absolute -right-6 top-0 text-[1.2em] animate-float" style={{
                                filter: "drop-shadow(0 5px 3px rgba(0,0,0,0.1))"
                            }}>
                                🧑‍🦳
                            </span>
                        </div>

                        <span className="relative font-black italic text-indigo-600">
                            LIKE A 
                            <span className="relative inline-block ml-2">
                                CAVEMAN
                                <span className="absolute -right-6 -top-4 text-[0.8em] origin-bottom transform rotate-[-20deg] animate-hit">
                                    🔨
                                </span>
                            </span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Subtle floating circles decoration */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <div 
                        key={i}
                        className="absolute rounded-full opacity-10"
                        style={{
                            background: `radial-gradient(circle, var(--tw-gradient-from), transparent)`,
                            width: `${Math.random() * 200 + 100}px`,
                            height: `${Math.random() * 200 + 100}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            transform: `translate(-50%, -50%)`,
                            mixBlendMode: 'multiply'
                        }}
                    ></div>
                ))}
            </div>
        </div>
    )
}

export default HorizontalScrolling;