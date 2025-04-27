import React, { useRef, useState } from 'react';
import HeroSection from './HeroSection';
import Card from './Card';
import HorizontalScrolling from './HorizontalScrolling';
import styles from "./Home.module.scss";
import Footer from './Footer';
import HoverDiv from './HoverDiv';
import GetStartButton from './GetStartBtn';

const Home = () => {
  const [hoverState, setHoverState] = useState({
    isHovering: false,
    activeImage: null,
    position: { x: 0, y: 0 }
  });

  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (hoverState.isHovering) {
      setHoverState(prev => ({
        ...prev,
        position: { x: e.clientX, y: e.clientY }
      }));
    }
  };

  
  return (
    <div 
      className='ml-[-4vmin] bg-[#f1f1f1]'
      onMouseMove={handleMouseMove}
      ref={containerRef}
    >
      <HeroSection />
      <div className={`pt-[1vmin] ${styles.second} flex flex-col`}>
        <Card />
      </div>
      <HorizontalScrolling />

      <HoverDiv hoverState={hoverState} setHoverState={setHoverState}/>
    
      <div className='relative w-full h-10 flex flex-row justify-center items-center translate-y-[-40px]'>
        <GetStartButton/>
      </div>
      <Footer/>

    </div>
  );
};

export default Home;