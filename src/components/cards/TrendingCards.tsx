import React from "react";

type Props = {};

function TrendingCards({}: Props) {
  return (
    <div className="h-[350px] rounded-[20px] relative  items-center justify-center flex w-full bg-gradient-to-r from-[#F6E8DF] to-[#E7FDFF]">
      <div className="z-10 px-[3%] flex-row flex absolute w-full justify-between top-5">
        <button className="px-4 py-1 bg-[#013237] text-white rounded-[4px] font-bold text-sm fornt-Helvetica">
          Music
        </button>
        <div className="flex flex-row gap-4 items-center">
          <img
            src="/Images/1564530_arrow_next_share_direction_icon 1.svg"
            className="w-[24px] h-[24px]"
            alt=".."
          />

          <img src="/Images/icons.svg" className="w-[24px] h-[24px]" alt=".." />
        </div>
      </div>
      <img
        src="/Images/panaParty.svg"
        alt="pana_party"
        className="w-full h-auto top-10 absolute "
      />
      <div className="w-[90%] top-[190px] bg-[#F6E8DF4D] backdrop-blur-md h-[130px] absolute  rounded-[20px] shadow-sm">
        <p className="text-lg text-[#013237] font-bold p-4 ">
          Metaverse Festival
        </p>
      </div>
    </div>
  );
}

export default TrendingCards;
