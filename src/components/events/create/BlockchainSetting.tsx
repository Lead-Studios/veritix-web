"use client";

import React from "react";
import { EventFormData } from "@/app/(protected)/events/create/page";
import RadioButton from "../ui/RadioButton";

interface BlockchainSettingProps {
  formData: EventFormData;
  updateFormData: (updates: Partial<EventFormData>) => void;
}

export default function BlockchainSetting({
  formData,
  updateFormData,
}: BlockchainSettingProps) {
  return (
    <section className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
          5
        </div>
        <h2 className="text-2xl font-bold text-white">Blockchain Setting</h2>
      </div>

      <div className="space-y-6">
        {/* Select Blockchain Network */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Select Blockchain Network
          </label>
          <div className="flex gap-4">
            <RadioButton
              id="ethereum"
              name="blockchainNetwork"
              value="ethereum"
              checked={formData.blockchainNetwork === "ethereum"}
              onChange={(e) =>
                updateFormData({
                  blockchainNetwork: e.target.value as "ethereum",
                })
              }
              label="Ethereum"
            />
            <RadioButton
              id="polygon"
              name="blockchainNetwork"
              value="polygon"
              checked={formData.blockchainNetwork === "polygon"}
              onChange={(e) =>
                updateFormData({
                  blockchainNetwork: e.target.value as "polygon",
                })
              }
              label="Polygon"
            />
            <RadioButton
              id="solana"
              name="blockchainNetwork"
              value="solana"
              checked={formData.blockchainNetwork === "solana"}
              onChange={(e) =>
                updateFormData({
                  blockchainNetwork: e.target.value as "solana",
                })
              }
              label="Solana"
            />
          </div>
        </div>

        {/* Treasury Address */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Treasury Address
          </label>
          <div>
            <input
              type="text"
              value={formData.treasuryAddress}
              onChange={(e) =>
                updateFormData({ treasuryAddress: e.target.value })
              }
              placeholder="e.g. 0x5..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              where funds will be sent
            </p>
          </div>
        </div>

        {/* Creator Royalty */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Creator Royalty
          </label>
          <p className="text-sm text-gray-400 mb-4">
            Percentage you'll receive from secondary sales.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={formData.creatorRoyalty}
                onChange={(e) =>
                  updateFormData({
                    creatorRoyalty: parseFloat(e.target.value),
                  })
                }
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                style={{
                  background: `linear-gradient(to right,rgb(51, 66, 234) 0%,rgb(59, 43, 201) ${(formData.creatorRoyalty / 10) * 100}%, #374151 ${(formData.creatorRoyalty / 10) * 100}%, #374151 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>10%</span>
              </div>
            </div>
            <div className="w-16 text-right">
              <span className="text-lg font-semibold text-white">
                {formData.creatorRoyalty.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
