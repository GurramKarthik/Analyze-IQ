import { cn } from "@/lib/utils";
import { InteractiveGridPattern } from "../magicui/interactive-grid-pattern";
import { InteractiveHoverButton } from "../magicui/interactive-hover-button";
import { useSelector } from "react-redux";
import { ToastMessage } from "./ToastMessage";
import { useNavigate } from "react-router-dom";


export default function HeroSection() {
  
  const {user} = useSelector(store => store.user)
  const navigate = useNavigate();

  const handleTryBtn = (event)=>{

    console.log(" try btn");
    console.log(user)
      if(!user){    
        ToastMessage("OPPS!", "Please Login to Access ")
      }else{
        navigate("./dashboard")
      }
  }

  return (
    <div className="relative flex h-[100vh] w-full flex-col items-center justify-center overflow-hidden bg-background md:shadow-xl">
     
     <InteractiveGridPattern
        className={cn(
          "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
        )}
        width={40}
        height={40}
        squares={[40, 40]}
        squaresClassName="hover:fill-green-400"
      />
      <p className="whitespace-pre-wrap text-center text-7xl font-medium tracking-tighter text-black dark:text-white">
           Analyze <span style={{color:"green"}}>IQ</span>
      </p>
      <p className="m-1 z-3" >Analyze. Visualize. Interpret. Automate</p>
      <p className="m-6 w-[70%] text-center">No more struggling with spreadsheets or writing complex formulas. CSV-Analyser makes data exploration effortless—just upload your CSV, ask questions, and watch AI generate instant insights with interactive visualizations.</p>
      
      <div className="bg-background z-3"><InteractiveHoverButton onClick={handleTryBtn} >Try AnalyzeIQ</InteractiveHoverButton></div>
      
    </div>
  );
}
