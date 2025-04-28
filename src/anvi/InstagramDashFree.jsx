import React from "react";

export default function InstagramDashFree() {
  return (
    <div className="min-h-screen bg-[#0e1c3f] text-white px-10 py-12 flex flex-col items-center gap-10">
      {/* Header */}
      <div className="flex flex-col items-center gap-4">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
          alt="Instagram Logo"
          className="w-36 h-36 rounded-full"
        />
        <h1 className="text-xl font-bold">@instagram</h1>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap justify-center gap-6">
        {[
          { label: "posts", value: "7987" },
          { label: "followers", value: "686M" },
          { label: "following", value: "161" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[#f4a100] w-40 h-20 rounded-xl flex flex-col items-center justify-center text-center"
          >
            <h2 className="text-xl font-bold text-black">{stat.value}</h2>
            <p className="text-sm text-black">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
        {[
          {
            title: "General",
            items: ["Page Viewers", "Shares Average", "Saves Average"],
          },
          {
            title: "Reels",
            items: ["Average Views", "Shares Average", "Saves Average"],
          },
          {
            title: "Threads",
            items: ["Likes", "Reposts", "Shares"],
          },
        ].map((section) => (
          <div
            key={section.title}
            className="bg-white text-black p-6 rounded-2xl shadow-md min-h-[250px]"
          >
            <h3 className="text-xl font-bold mb-3">{section.title}</h3>
            <ul className="space-y-2">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Pro Feature */}
      <div className="bg-[#f4a100] px-6 py-3 rounded-xl text-black font-semibold text-lg">
        Pro Feature Insights
      </div>
    </div>
  );
}