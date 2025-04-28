import React from "react";

export default function XDashboardFree() {
  return (
    <div className="min-h-screen bg-[#0e1c3f] text-white px-10 py-12 flex flex-col items-center gap-10">
      {/* Header */}
      <div className="flex flex-col items-center gap-4">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/9/91/X_logo_2023.svg"
          alt="X Logo"
          className="w-36 h-36 rounded-full bg-white p-4"
        />
        <h1 className="text-xl font-bold">@X</h1>
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

      {/* Free Features */}
      <div className="bg-white text-black p-6 rounded-2xl shadow-md w-full max-w-5xl min-h-[250px]">
        <ul className="space-y-2 text-lg">
          <li>Posts</li>
          <li>Shares</li>
          <li>Reposts</li>
          <li>Likes</li>
          <li>Views</li>
        </ul>
      </div>

      {/* Upgrade Prompt */}
      <div className="self-end bg-[#f4a100] px-6 py-3 rounded-xl text-black font-semibold text-lg">
        Pro Feature Insights
      </div>
    </div>
  );
}