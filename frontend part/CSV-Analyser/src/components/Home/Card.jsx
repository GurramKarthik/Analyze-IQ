"use client";
import { MagicCard } from "../magicui/magic-card";


export default function Card({title, details}) {
  return (
    <div className="cardHover w-full">
      <MagicCard
        className="cursor-pointer flex-col items-center justify-top whitespace-nowrap shadow-1xl z-[-1]  p-3 "
      >
        <p className="text-2xl text-center">{title}</p>
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


