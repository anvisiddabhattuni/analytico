import React from "react";

export default function Dashboard() {
  return (
    <div className="bg-[#0F1A36] text-white p-10 font-sans min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
            alt="Instagram Logo"
            className="w-20 h-20"
          />
          <span className="text-xl font-bold">@instagram</span>
        </div>

        {/* Stats */}
        <div className="flex justify-between mb-10">
          <div className="bg-[#F4A623] text-black p-4 rounded-md text-center w-1/3 mx-2">
            <div className="text-2xl font-bold">7987</div>
            <div className="text-sm">posts</div>
          </div>
          <div className="bg-[#F4A623] text-black p-4 rounded-md text-center w-1/3 mx-2">
            <div className="text-2xl font-bold">686M</div>
            <div className="text-sm">followers</div>
          </div>
          <div className="bg-[#F4A623] text-black p-4 rounded-md text-center w-1/3 mx-2">
            <div className="text-2xl font-bold">161</div>
            <div className="text-sm">following</div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white text-black p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">General</h2>
            <p>Page Viewers</p>
            <p>Shares Average</p>
            <p>Saves Average</p>
          </div>
          <div className="bg-white text-black p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Reels</h2>
            <p>Average Views</p>
            <p>Shares Average</p>
            <p>Saves Average</p>
          </div>
          <div className="bg-white text-black p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Threads</h2>
            <p>Likes</p>
            <p>Reposts</p>
            <p>Shares</p>
          </div>
        </div>

        {/* Pro Feature Button */}
        <div className="text-center">
          <div className="bg-[#F4A623] text-black py-3 px-6 rounded-md inline-block font-semibold">
            Pro Feature Insights
          </div>
        </div>
      </div>
    </div>
  );
}