"use client";

import { cn } from "@/lib/utils";
import { InteractiveGridPattern } from "../magicui/interactive-grid-pattern";
import { InteractiveHoverButton } from "../magicui/interactive-hover-button";

export default function HeroSection() {
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
      <p className="m-1" >Analyze. Visualize. Interpret. Automate</p>
      <p className="m-6 w-[70%] text-center">No more struggling with spreadsheets or writing complex formulas. CSV-Analyser makes data exploration effortless—just upload your CSV, ask questions, and watch AI generate instant insights with interactive visualizations.</p>
      
      <div className="bg-background"><InteractiveHoverButton >Try AnalyzeIQ</InteractiveHoverButton></div>
 
    </div>
  );
}
