"use client";

import React, { forwardRef, useRef } from "react";
import csv from "../../assets/csv.svg"
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "../magicui/animated-beam";

const Circle = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border-2 border-border bg-white p-4 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

export default function Beam({ className }) {
  const containerRef = useRef(null);
  const div1Ref = useRef(null);
  const div2Ref = useRef(null);
  const div3Ref = useRef(null);
  const div4Ref = useRef(null);
  const div5Ref = useRef(null);
  const div6Ref = useRef(null);
  const div7Ref = useRef(null);

  return (
    <div
      className={cn(
        "relative m-auto flex h-[500px] items-center justify-center overflow-hidden p-10 ",
        className
      )}
      ref={containerRef}
    >
      <div className="flex size-full max-w-lg flex-row items-center justify-between gap-10 ">
        <div className="flex flex-col items-center gap-4">
          <Circle ref={div1Ref} >
            <Icons.googleDrive />
          </Circle>
          <Circle ref={div2Ref}>
            <Icons.googleDocs />
          </Circle>
          <Circle ref={div3Ref}>
            <Icons.whatsapp />
          </Circle>
          <Circle ref={div4Ref}>
            <Icons.messenger />
          </Circle>
          <Circle ref={div5Ref}>
            <Icons.csv />
          </Circle>
        </div>
        <div className="flex flex-col items-center">
          <Circle ref={div6Ref} className="size-16">
            <Icons.openai />
          </Circle>
        </div>
        <div className="flex flex-col items-center">
          <Circle ref={div7Ref}>
            <Icons.user />
          </Circle>
        </div>
      </div>

      <AnimatedBeam containerRef={containerRef} fromRef={div1Ref} toRef={div6Ref}  curvature="2"  />
      <AnimatedBeam containerRef={containerRef} fromRef={div2Ref} toRef={div6Ref} curvature="2" />
      <AnimatedBeam containerRef={containerRef} fromRef={div3Ref} toRef={div6Ref}  curvature="2" />
      <AnimatedBeam containerRef={containerRef} fromRef={div4Ref} toRef={div6Ref}  curvature="2"/>
      <AnimatedBeam containerRef={containerRef} fromRef={div5Ref} toRef={div6Ref} curvature="2"/>
      <AnimatedBeam containerRef={containerRef} fromRef={div6Ref} toRef={div7Ref} curvature="2"/>
    </div>
  );
}

const Icons = {
  csv: () => <img src={csv} style={{transform:"scale(1)"}}></img>,
  openai: () => <></>,
  googleDrive: () => <></>,
  whatsapp: () => <></>,
  googleDocs: () => <></>,
  zapier: () => <></>,
  messenger: () => <></>,
  user: () => <></>,
};
