import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { InteractiveGridPattern } from "../magicui/interactive-grid-pattern";
import { MorphingText } from "../magicui/morphing-text";
import { ToastMessage } from "./ToastMessage";
import homeScreenImg1 from "../../assets/homeScreenImg1.png"
import styles from "./Home.module.scss";
import { WarpBackground } from "@/components/magicui/warp-background";
import { useTheme } from "next-themes";


export default function HeroSection() {

  
  const texts = [
    "IQ",
    "CSV",
    "Effortlessly",
    "Patterns",
    "Visually"
  ];
  
  const {user} = useSelector(store => store.user)
  const navigate = useNavigate();

  const handleTryBtn = (event)=>{

    
    
      if(!user){    
        ToastMessage("OPPS!", "Please Login to Access ")
      }else{
        navigate("./dashboard")
      }
  }
  const { theme } = useTheme();
  const bgColor = theme === 'light' ? '#ddd' : '#222'

  return (
    // bg-gradient-to-br" style={{ backgroundImage: 'linear-gradient(135deg, #FFD1DC, #E1BEE7' }}
    
    <div     className={`sticky top-[3vmin] flex h-[100vh]  flex-col  justify-center overflow-hidden ` }>
     
     {/* <InteractiveGridPattern
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)] z-[0] ",
        )}
        width={40}
        height={40}
        squares={[40, 40]}
        squaresClassName="rounded-[10px] hover:fill-green-400"
      /> */}
        
        
        <WarpBackground className='w-full h-full mt-[-4vmin]'>
            <div className="flex flex-col items-center justify-center text-center w-full z-[20] gap-0">
            <p className="text-center font-bold text-[14vmin] mb-[0px]">Analyze</p>
            <MorphingText texts={texts}   className='text-[#16a34a] text-[8vmin] mt-[-4vmin]'   />
          </div>

          <p className="text-center mt-[14vmin] z-[10] text-[3.5vmin] font-bold ">WHERE AI MEETS DATA VISUALIZATION</p>
          <p className="text-center  z-[10] text-[2vmin]  ">• NO CODE • NO COMPLEXITY • JUST ANSWERS</p>
        </WarpBackground>

      
      
      {/* <div className={styles.heroImage}>
        <img src={homeScreenImg1} alt="image"/>
      </div> */}
      {/* <img src={homeScreenImg1} alt="image" className={styles.heroImage}/> */}




      {/* <div className=" flex gap-4 m-[-3vmin] flex-end">
        <p style={{fontSize:"12vmin", fontWeight:"bold", margin:"-10vmin"}}> Analyze</p>  <MorphingText texts={texts}   className='text-[#16a34a]' />
      </div>
      <p className="m-1 z-3" >Analyze. Visualize. Interpret. Automate</p>
      <p className="m-6 w-[70%] text-center">No more struggling with spreadsheets or writing complex formulas. CSV-Analyser makes data exploration effortless—just upload your CSV, ask questions, and watch AI generate instant insights with interactive visualizations.</p>
      
      <div className="bg-background z-3"><InteractiveHoverButton onClick={handleTryBtn} >Try AnalyzeIQ</InteractiveHoverButton></div>
       */}


    </div>
  );
}



// import styles from "./Home.module.scss";
// import { useGSAP } from "@gsap/react";
// import gsap from 'gsap';
// import { delay } from "motion";
// import { useRef } from "react";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// gsap.registerPlugin(ScrollTrigger);



// const HeroSection = () => {

//     const topRef =  useRef(null)
//     const container = useRef(null);

//     useGSAP(() => {
//       // Define the scroll-triggered animation
//       gsap.fromTo(
//         topRef.current, // Target element
//         {
//           y: '30%', // Initial position (no movement)
//         },
//         {
//           y: "-30%", // Move upward to 30% of the viewport height
//           duration: 2, // Duration of the animation
//           ease: "power2.out", // Easing for smooth animation
//           scrollTrigger: {
//             trigger: topRef.current, // The element that triggers the animation
//             markers: true, // Debugging markers
//             start: "top 20%", // Start when the top of the element reaches 80% of the viewport
//             end: "top 0%", // End when the top of the element reaches 40% of the viewport
//             scrub: 2, // Smooth scrubbing effect (duration of scrub in seconds)
//           },
//         }
//       );
//     });
//   return (
//     <div className={styles.heroContainer} ref={container}>
//         <div className={`top ${styles.heroTop} `} ref={topRef}>
//           asd
//         </div>
//         <div className={styles.heroBottom}>asd</div>

//     </div>
//   )
// }

// export default HeroSection