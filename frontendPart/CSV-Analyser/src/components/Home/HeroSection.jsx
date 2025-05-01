import { MorphingText } from "../magicui/morphing-text";
import { WarpBackground } from "@/components/magicui/warp-background";



export default function HeroSection() {

  
  const texts = [
    "IQ",
    "CSV",
    "Effortlessly",
    "Patterns",
    "Visually"
  ];
  return (
    <div     className={`sticky top-[3vmin] flex h-[100vh]  flex-col  justify-center overflow-hidden ` }>
        <WarpBackground className='w-full h-full mt-[-4vmin]'>
            <div className="flex flex-col items-center justify-center text-center w-full z-[20] gap-0">
            <p className="text-center font-bold text-[14vmin] mb-[0px]">Analyze</p>
            <MorphingText texts={texts}   className='text-[#16a34a] text-[8vmin] mt-[-4vmin]'   />
          </div>

          <p className="text-center mt-[14vmin] z-[10] text-[3.5vmin] font-bold ">WHERE AI MEETS DATA VISUALIZATION</p>
          <p className="text-center  z-[10] text-[2vmin]  ">• NO CODE • NO COMPLEXITY • JUST ANSWERS</p>
        </WarpBackground>


    </div>
  );
}