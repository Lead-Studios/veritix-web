import React from "react";
import NFTTicketCard from "./NFTTicketCard";

const NFTInfoSection = () => {
  return (
    <div className="bg-[#0a0e21] py-16 pb-[120px]">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-[#0c1130] to-[#151d45] rounded-2xl border border-[#1c2044] overflow-hidden max-w-6xl mx-auto shadow-lg">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 p-8 md:p-12 xl:p-16">
            <div className="w-full lg:w-[45%]">
              <h2 className="text-3xl md:text-1xl font-semibold text-white mb-4">
                Collect Digital<br />Memorabilia
              </h2>
              
              <p className="text-gray-300 mb-8 max-w-xl">
                Each NFT ticket is a unique digital collectible that serves as 
                both your event access and a lasting memento. Tickets 
                feature exclusive artwork, animations, and metadata that 
                commemorate your experience.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-1 bg-blue-500 rounded-full mr-4 mt-1"></div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">Verifiable Authenticity</h3>
                    <p className="text-gray-400 text-sm">
                      Each ticket has a unique blockchain signature 
                      that proves its authenticity
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-1 bg-blue-500 rounded-full mr-4 mt-1"></div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">Tradable Assets</h3>
                    <p className="text-gray-400 text-sm">
                      Trade or sell your tickets on popular NFT 
                      marketplaces after the event
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-1 bg-blue-500 rounded-full mr-4 mt-1"></div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">Unlockable Content</h3>
                    <p className="text-gray-400 text-sm">
                      Access exclusive digital content and physical 
                      merchandise with your NFT
                    </p>
                  </div>
                </div>
              </div>
              
              <button className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white font-medium py-3 px-8 rounded-full transition-all duration-300">
                Learn More
              </button>
            </div>
            
            <div className="w-full lg:w-[55%] flex justify-center">
              <NFTTicketCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTInfoSection; 