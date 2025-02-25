import React from "react";


const EventCard = ({image, title, subHeading, location, className }) => {
  return (
    <div className={`w-[350px] border border-[#335500] mx-auto min-w-[270px] h-[430px] gap-5 bg-[#DDDBE9] rounded-md p-7 flex flex-col items-start justify-start ${className} `} >
      <div className="overflow-hidden rounded-md flex items-center justify-center w-full h-[65%] ">
        <img
          src={image} 
          alt="Event"
          className="w-full rounded-md object-cover "
        />
      </div>
      <div className=" text-left w-full text-[#000000] ">
        <h2 className="text-lg font-bold"> {title} </h2>
        <p className=" font-semibold text-base my-1"> {subHeading} </p>
        <p className="font-semibold text-[15px] max-w-[240px] ">
         {location}
        </p>
      </div>
    </div>
  );
};

export default EventCard;
