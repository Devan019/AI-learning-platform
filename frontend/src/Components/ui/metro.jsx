import { cn } from "../../lib/utils";
import React from "react";
import "./metro.css";

export const Meteors = ({ number, className }) => {
  const meteors = new Array(number || 20).fill(true);

  return (
    <>
      {meteors.map((_, idx) => {
        const randomX = Math.floor(Math.random() * 400 - 200); // Random X position
        const randomY = Math.floor(Math.random() * 400 - 200); // Random Y position
        const randomDelay = Math.random() * (1.5 - 0.2) + 0.2; // Random delay
        const randomDuration = Math.random() * (3 - 1) + 1; // Random duration

        return (
          <span
            key={"meteor" + idx}
            className={cn(
              "animate-meteor-effect absolute h-0.5 w-0.5 rounded-full bg-slate-500 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]",
              "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-[#64748b] before:to-transparent",
              className
            )}
            style={{
              top: randomY + "px",
              left: randomX + "px",
              animationDelay: `${randomDelay}s`,
              animationDuration: `${randomDuration}s`,
            }}
          />
        );
      })}
    </>
  );
};
