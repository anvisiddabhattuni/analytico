import React from "react";
import { cn } from "../../lib/utils";

function DisplayCard({
  className,
  icon,
  title = "Analytics",
  description = "Track your growth",
  date = "Live data",
  iconClassName = "bg-orange-500/20",
  titleClassName = "text-orange-400",
}) {
  return (
    <div
      className={cn(
        "relative flex h-36 w-[22rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-3 transition-all duration-700",
        "after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[20rem] after:bg-gradient-to-l after:from-[#08070b] after:to-transparent after:content-['']",
        "hover:border-white/20 hover:bg-white/8",
        "[&>*]:flex [&>*]:items-center [&>*]:gap-2",
        className
      )}
    >
      <div>
        <span className={cn("relative inline-flex h-7 w-7 items-center justify-center rounded-full", iconClassName)}>
          {icon}
        </span>
        <p className={cn("text-lg font-semibold font-display", titleClassName)}>{title}</p>
      </div>
      <p className="whitespace-nowrap text-sm text-white/80">{description}</p>
      <p className="text-xs text-white/40">{date}</p>
    </div>
  );
}

export default function DisplayCards({ cards }) {
  const defaultCards = [
    {
      className:
        "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-full before:rounded-xl before:h-full before:content-[''] before:bg-black/30 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
      icon: <span className="text-xs font-bold text-orange-300">IG</span>,
      title: "Instagram",
      description: "12.4K followers · 4.8% engagement",
      date: "Updated just now",
      iconClassName: "bg-orange-500/20",
      titleClassName: "text-orange-400",
    },
    {
      className:
        "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-full before:rounded-xl before:h-full before:content-[''] before:bg-black/30 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
      icon: <span className="text-xs font-bold text-blue-300">FB</span>,
      title: "Facebook",
      description: "5.8K page likes · 14.2K weekly reach",
      date: "Updated just now",
      iconClassName: "bg-blue-500/20",
      titleClassName: "text-blue-400",
    },
    {
      className: "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10",
      icon: <span className="text-xs font-bold text-white/60">Th</span>,
      title: "Threads",
      description: "3.1K followers · 892 avg. reposts",
      date: "Updated just now",
      iconClassName: "bg-white/10",
      titleClassName: "text-white/70",
    },
  ];

  const displayCards = cards || defaultCards;

  return (
    <div className="grid animate-in fade-in-0 place-items-center opacity-100 duration-700 [grid-template-areas:'stack']">
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}
