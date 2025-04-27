import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import homeImg from "../../assets/homeScreenImg1.png";
import DashboardImg from "../../assets/DashboardImg.png";

const Card = () => {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Content for our sections
  const sections = [
    {
      title: "First Section",
      content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem numquam aliquid nesciunt fuga voluptatibus nemo itaque repudiandae, doloribus impedit consequuntur.",
      image: DashboardImg
    },
    {
      title: "Second Section",
      content: "Deserunt voluptates illum fuga consequatur ex totam. Placeat distinctio corporis ratione nostrum eveniet voluptates eos, aperiam ipsa corrupti sit.",
      image: homeImg
    },
    {
      title: "Third Section",
      content: "Perferendis eveniet ducimus, omnis ab similique molestias ipsam, dicta doloremque a quidem quibusdam mollitia non in rerum consectetur.",
      image: homeImg
    }
  ];

  // Text animation variants
  const textContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        when: "beforeChildren"
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.02,
        staggerDirection: -1,
        when: "afterChildren"
      }
    }
  };
  
  const textItem = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  };

  // Image animation variants
  const imageVariants = {
    hidden: { x: 400, opacity: 0, scale: 0.4 },
    visible: { x: 0, opacity: 1, scale: 1, transition: { duration: 1 } },
    exit: { x: -400, opacity: 0, scale: 0.4, transition: { duration: 1 } }
  };

  // Scroll handler to update active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Calculate which section should be active based on scroll position
      const sectionHeight = windowHeight * 0.8; // 80% of viewport height
      const newIndex = Math.min(
        Math.floor(scrollPosition / sectionHeight),
        sections.length - 1
      );
      
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeIndex, sections.length]);

  return (
    <div ref={containerRef} className="min-h-[300vh] relative">
      {/* Sticky container for content that stays on screen */}
      
      <div  className="sticky top-0 h-screen flex flex-col items-end justify-center">
        <div className="max-w-6xl mx-auto w-full flex flex-row justify-between gap-5 items-center pl-[3vmin] pr-[3vmin]">
          {/* Text Content - Left Side */}
          <div className="w-[45%] h-[50vh] flex flex-col justify-center ">
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${activeIndex}`}
                initial="hidden"
                animate="show"
                exit="exit"
                variants={textContainer}
                className="overflow-hidden"
              >
                <motion.h2 
                  className="text-3xl font-bold mb-6"
                  variants={textItem}
                >
                  {sections[activeIndex].title}
                </motion.h2>
                
                {sections[activeIndex].content.split(' ').map((word, i) => (
                  <motion.span 
                    key={i} 
                    className="inline-block mr-1"
                    variants={textItem}
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Image Content - Right Side */}
          <div  className="w-[60%] h-[90vh] flex flex-col justify-center items-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={`image-${activeIndex}`}
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full h-fulll flex flex-col  justify-center items-center "
              >
                <img 
                  className="w-[100%] h-[100%] object-cover rounded-lg  " 
                  src={sections[activeIndex].image} 
                  alt={`Section ${activeIndex + 1}`} 
                />
               
              </motion.div>

            </AnimatePresence>
          
          </div>            
        </div>
        
      </div>
     
      
      {/* Spacer divs to create scroll distance */}
      {sections.map((_, index) => (
        <div 
          key={index} 
          className="h-screen w-full opacity-0"
          id={`section-spacer-${index}`}
        />
      ))}
   
    </div>
  );
};

export default Card;