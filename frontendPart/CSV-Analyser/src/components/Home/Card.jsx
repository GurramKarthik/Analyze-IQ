import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import homeImg from "../../assets/homeScreenImg1.png";
import DashboardImg from "../../assets/DashboardImg.png";
import chatImg from "../../assets/chatWithData.svg";
import rawToDash from "../../assets/rawToDash.jpg";
import NoCode from "../../assets/NoCode.svg";

const Card = () => {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Content for our sections with color coding
  const sections = [
    {
      title: "Revolutionize Data Analysis with AI-Powered Insights",
      content: "Tired of spending hours cleaning data, writing code, or manually building dashboards? AnalyseIQ automates the entire process! Just upload your CSV/Excel file, and our AI-driven platform performs EDA, detects outliers, recommends insights, and generates interactive visualizations—all in seconds. Focus on decisions, not data wrangling!",
      image: DashboardImg,
      accentColor: "#6366F1", // Indigo
      bgColor: "#EEF2FF" // Light indigo
    },
    {
      title: "Instant Visualizations, Zero Effort",
      content: "No more drag-and-drop tools or complex scripting. AnalyseIQ understands your data and instantly creates the most meaningful visualizations—from trends to outliers. Whether you're a data scientist or a business user, get stunning, interactive charts with a single click.",
      image: homeImg,
      accentColor: "#10B981", // Emerald
      bgColor: "#ECFDF5" // Light emerald
    },
    {
      title: "Chat with Your Data—Like Never Before",
      content: "Why write code or formulas when you can just ask? AnalyseIQ's built-in AI chat lets you query your data in plain English. Need a scatter plot? Ask. Want to compare metrics? Just type. Get insights and visualizations on-demand, as if you had a data analyst by your side!",
      image: chatImg,
      accentColor: "#F59E0B", // Amber
      bgColor: "#FFFBEB" // Light amber
    },
    {
      title: "From Raw Data to Dashboard—Automagically",
      content: "Upload. Relax. Done. AnalyseIQ transforms raw data into a ready-to-share dashboard with summaries, stats, and visuals. Perfect for quick reports, presentations, or exploratory analysis. Say goodbye to tedious manual work and hello to AI-powered efficiency!",
      image: rawToDash,
      accentColor: "#3B82F6", // Blue
      bgColor: "#EFF6FF" // Light blue
    },
    {
      title: "Built for Everyone—No Expertise Needed",
      content: "Data analysis shouldn't require a PhD or expensive tools. AnalyseIQ democratizes insights with an intuitive interface powered by GenAI. Whether you're in business, academia, or just curious—unlock the story behind your data effortlessly.",
      image: NoCode,
      accentColor: "#8B5CF6", // Violet
      bgColor: "#F5F3FF" // Light violet
    }
  ];

  // Animation variants
  const textContainer = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        staggerChildren: 0.02,
        staggerDirection: -1
      }
    }
  };
  
  const textItem = {
    hidden: { y: 10, opacity: 0 },
    show: { y: 0, opacity: 1 },
    exit: { y: -10, opacity: 0 }
  };

    // Enhanced animation variants
    const headingVariants = {
      hidden: { 
        y: 40, 
        opacity: 0,
        rotateX: 15,
        filter: 'blur(4px)'
      },
      visible: { 
        y: 0, 
        opacity: 1,
        rotateX: 0,
        filter: 'blur(0px)',
        transition: {
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1]
        }
      },
      exit: { 
        y: -40, 
        opacity: 0,
        rotateX: -15,
        filter: 'blur(4px)',
        transition: {
          duration: 0.6,
          ease: [0.7, 0, 0.84, 0]
        }
      }
    };
  
    const textVariants = {
      hidden: { 
        y: 20, 
        opacity: 0,
        filter: 'blur(2px)'
      },
      visible: (i) => ({ 
        y: 0, 
        opacity: 1,
        filter: 'blur(0px)',
        transition: {
          delay: i * 0.02 + 0.3,
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1]
        }
      }),
      exit: { 
        y: -20, 
        opacity: 0,
        filter: 'blur(2px)',
        transition: {
          duration: 0.4,
          ease: [0.7, 0, 0.84, 0]
        }
      }
    }

  const imageVariants = {
    hidden: { x: 100, opacity: 0, scale: 0.95 },
    visible: { 
      x: 0, 
      opacity: 1, 
      scale: 1, 
      transition: { 
        type: "spring",
        damping: 20,
        stiffness: 100
      } 
    },
    exit: { 
      x: -100, 
      opacity: 0, 
      scale: 0.95,
      transition: { 
        duration: 0.5 
      } 
    }
  };

  // Scroll handler with throttle
  useEffect(() => {
    let timeoutId = null;
    
    const handleScroll = () => {
      if (timeoutId) return;
      
      timeoutId = setTimeout(() => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const sectionHeight = windowHeight * 0.8;
        
        const newIndex = Math.min(
          Math.floor(scrollPosition / sectionHeight),
          sections.length - 1
        );
        
        if (newIndex !== activeIndex) {
          setActiveIndex(newIndex);
        }
        
        timeoutId = null;
      }, 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [activeIndex]);

  return (
    <div ref={containerRef} className="relative bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0]">
      {/* Sticky container */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 transition-colors duration-500"
          style={{ backgroundColor: sections[activeIndex].bgColor }}
        />
        
        <div className="relative z-10 max-w-7xl w-full px-8 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <div className="w-full lg:w-1/2 space-y-6 px-4">
            <AnimatePresence mode="wait">
              <motion.h2
                key={`heading-${activeIndex}`}
                variants={headingVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-4xl md:text-5xl font-bold leading-tight"
                style={{ color: sections[activeIndex].accentColor }}
              >
                {sections[activeIndex].title}
              </motion.h2>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${activeIndex}`}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-lg md:text-xl text-gray-700 leading-relaxed"
              >
                {sections[activeIndex].content.split(' ').map((word, i) => (
                  <motion.span
                    key={i}
                    custom={i}
                    variants={textVariants}
                    className="inline-block mr-1.5"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* ... (button remains the same) */}
          </div>
          
          {/* Image Content */}
          <div className="w-full lg:w-1/2 h-[60vh] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={`image-${activeIndex}`}
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full h-full flex items-center justify-center p-4"
              >
                <div 
                  className="w-full h-full rounded-2xl shadow-2xl overflow-hidden border-8 border-white"
                  style={{ borderColor: sections[activeIndex].accentColor }}
                >
                  <img 
                    className="w-full h-full object-cover" 
                    src={sections[activeIndex].image} 
                    alt={`Feature ${activeIndex + 1}`}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Scroll spacers */}
      {sections.map((_, index) => (
        <div 
          key={index} 
          className="h-screen w-full"
          id={`section-spacer-${index}`}
        />
      ))}
    </div>
  );
};

export default Card;