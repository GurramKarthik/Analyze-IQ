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
              x: () => -(textRef.current.scrollWidth - document.documentElement.clientWidth +1390),
              ease: "none",
              scrollTrigger: {
                trigger: horizontalSectionRef.current,
                start: "top top",
                end: () => `+=${textRef.current.scrollWidth - document.documentElement.clientWidth }`,
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
      
        // Hammer smash effect on scroll
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
      
        // Text color pulse on scroll
        gsap.to(".bg-gradient-to-r", {
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
    <div ref={horizontalSectionRef} className="h-screen bg-[#017b92]">
    <div 
      ref={sideScrollRef} 
      className="h-full flex items-center overflow-hidden"
    >
      <div ref={textRef} 
      className="relative translate-x-[120vw] text-[9vmax] md:text-[16vmax] whitespace-nowrap pl-8 flex items-center h-full"
      >
    {/* Main text container */}
    <div className="flex items-center space-x-6">
    {/* "NO MORE" */}
    <span className="font-bold text-gray-300 opacity-90 tracking-tight">NO MORE</span>

    {/* Animated caveman section */}
    <div className="relative inline-block">
    {/* "STARING AT SPREADSHEETS" */}
    <span className="font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-red-600">
        STARING AT SPREADSHEETS
    </span>
    
    {/* Caveman emoji with movement */}
    <span className="absolute -right-6 top-0 text-[1.2em] animate-float" style={{
        animation: "float 3s ease-in-out infinite",
        filter: "drop-shadow(0 5px 3px rgba(0,0,0,0.3))"
    }}>
        🧑‍🦳
    </span>
    </div>

    {/* "LIKE A CAVEMAN" with hammer smash effect */}
    <span className="relative font-black italic text-cyan-400">
    LIKE A 
    <span className="relative inline-block ml-2">
        CAVEMAN
        {/* Hammer icon that "hits" the text */}
        <span className="absolute -right-6 -top-4 text-[0.8em] origin-bottom transform rotate-[-20deg] animate-hit">
        🔨
        </span>
    </span>
    </span>
    </div>
    </div>
    </div>
  </div>
  )
}

export default HorizontalScrolling