import React, { useState } from "react";
import { BackgroundBeams } from "../Components/ui/bg-beams";
import { Navbar } from "../Components/Nav";
import missionsWithRewards from "../data/mission.data.json";

const coinRewards = [
  { name: "🎽 T-Shirt", price: 5000 },
  { name: "🎟️ Sticker Pack", price: 2000 },
  { name: "🎧 Headphones", price: 10000 },
  { name: "💳 Gift Card", price: 7000 },
];

export function Store() {
  const [missions] = useState(missionsWithRewards);

  return (
    <div className="w-full min-h-screen bg-[#0d0d0d] relative flex flex-col items-center antialiased">
      <Navbar />
      <div className="mt-16 max-w-5xl mx-auto p-6">
        {/* Store Title */}
        <h2 className="text-white text-4xl font-extrabold text-center mb-10 tracking-wide">
          💰 Coin Exchange Store 🛒
        </h2>

        {/* Coin Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coinRewards.map((reward, index) => (
            <div
              key={index}
              className="w-full bg-zinc-900 text-white p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center 
              transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] ring-1 ring-gray-700 hover:ring-2 hover:ring-purple-500/50"
            >
              <h3 className="text-xl font-semibold tracking-wide">{reward.name}</h3>
              <p className="text-yellow-400 font-bold text-lg mt-2">💰 {reward.price} Coins</p>
              <button className="bg-gray-700 text-white px-6 py-3 mt-5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg">
                🔄 Redeem
              </button>
            </div>
          ))}
        </div>
      </div>

      <BackgroundBeams />
    </div>
  );
}
