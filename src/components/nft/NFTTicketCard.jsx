import React from "react";
import { FaEthereum } from "react-icons/fa";

const NFTTicketCard = () => {
  return (
    <div className="relative w-full max-w-[480px] h-[280px] bg-[#101630] rounded-3xl overflow-hidden border border-[#2a325e] shadow-[0_0_30px_rgba(79,70,229,0.45)] hover:shadow-[0_0_40px_rgba(79,70,229,0.6)] transition-all">
      <div className="absolute top-4 right-4">
        <div className="w-12 h-12 rounded-full bg-[#1a2046] flex items-center justify-center shadow-lg">
          <span className="text-[#7974fb]">
            <svg width="20" height="32" viewBox="0 0 28 45" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.7137 0L13.4185 0.995069V30.7468L13.7137 31.0407L27.4274 22.8737L13.7137 0Z" fill="#7974FB"/>
              <path d="M13.7137 0L0 22.8737L13.7137 31.0407V16.6243V0Z" fill="#A7A4FD"/>
              <path d="M13.7137 33.6361L13.5478 33.8384V44.4163L13.7137 44.9L27.4357 25.4736L13.7137 33.6361Z" fill="#7974FB"/>
              <path d="M13.7137 44.9V33.6361L0 25.4736L13.7137 44.9Z" fill="#A7A4FD"/>
              <path d="M13.7137 31.0407L27.4273 22.8737L13.7137 16.6243V31.0407Z" fill="#5652D3"/>
              <path d="M0 22.8737L13.7137 31.0407V16.6243L0 22.8737Z" fill="#7974FB"/>
            </svg>
          </span>
        </div>
      </div>

      <div className="p-7 h-full flex flex-col">
        <div className="bg-blue-600 text-xs font-medium text-white px-3.5 py-1.5 rounded-full w-fit">
          VIP Access
        </div>
        
        <div className="mt-auto">
          <h3 className="text-white font-medium text-xl mb-2">Metaverse Festival</h3>
          <p className="text-gray-400 text-sm">Oct 25, 2025 • New York</p>
          
          <div className="mt-5 flex items-center justify-between">
            <span className="text-xs bg-transparent rounded-full px-3 py-0.5 text-gray-400 border border-[#2a325e]">
              <span className="opacity-70">On-Chain</span>
            </span>
            
            <div className="flex items-center">
              <FaEthereum className="text-white mr-1.5 text-lg" />
              <span className="text-white font-medium">0.15 ETH</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTTicketCard; 