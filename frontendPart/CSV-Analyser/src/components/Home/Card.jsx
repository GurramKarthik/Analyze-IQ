"use client";
import { MagicCard } from "../magicui/magic-card";


export default function Card({title, details}) {
  return (
    <div className="grow h-[13rem]">
      <MagicCard
        className="cursor-pointer flex-col items-center justify-center whitespace-nowrap shadow-1xl z-[-1]  p-3 ">
        <p className="text-[3.5vmin] text-center"><strong>{title}</strong></p>
        <div className="text text-left mt-4">
          {
            details.map((item, index)=>{
             return  <li key={index}>{item}</li>
            })
          }
        </div>
      </MagicCard>
      </div>
    );
}


