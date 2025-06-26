import React, { useState } from "react";
import { BackgroundBeams } from "../Components/ui/bg-beams";
import { Navbar } from "../Components/Nav";
import missionsWithRewards from "../data/mission.data.json";
import { AdminLink } from "../Components/AdminLink";

const coinRewards = [
  { name: "🎽 T-Shirt", price: 5000 },
  { name: "🎟️ Sticker Pack", price: 2000 },
  { name: "🎧 Headphones", price: 10000 },
  { name: "💳 Gift Card", price: 7000 },
];

export function Rewards() {
  const [missions] = useState(missionsWithRewards);

  return (
    <div className="w-full min-h-screen bg-[#0d0d0d] relative flex flex-col items-center antialiased">
      <Navbar />
      <AdminLink />
      <div className="mt-16 max-w-4xl mx-auto p-6">
        <h1 className="text-white text-4xl font-extrabold text-center mb-8">
          🎯 Missions & Rewards 🏆
        </h1>

        <div className="flex flex-row flex-wrap justify-center items-center space-y-8">
          {missions.map((mission, index) => (
            <div
              key={index}
              className="w-[90vh] bg-zinc-900 text-white p-6 rounded-3xl shadow-xl flex justify-between items-center border border-gray-700 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              <div>
                <h2 className="text-2xl font-semibold tracking-wide flex items-center">
                  🚀 {mission.mission_name}
                </h2>
                <p className="text-gray-300 text-sm mt-2 max-w-md">
                  {mission.mission_detail}
                </p>
                <p className="text-yellow-400 font-bold mt-2 flex items-center gap-1">
                  💰 {mission.mission_rewards} Coins
                </p>
              </div>
              <div className="flex gap-4 mt-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full transition-all duration-200 shadow-md hover:shadow-lg">
                  🔗 Go To
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full transition-all duration-200 shadow-md hover:shadow-lg">
                  🎁 Claim
                </button>
              </div>
            </div>
          ))}
        </div>

       
      </div>
      <BackgroundBeams />
    </div>
  );
}
