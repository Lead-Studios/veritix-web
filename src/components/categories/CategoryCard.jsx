import React from "react";
import { Link } from "react-router-dom";

const CategoryCard = ({ icon, title, description, count, events, id }) => {
  return (
    <div className="relative flex flex-col items-center justify-center p-8 rounded-xl bg-[#0a0e21] border border-[#1c2044] hover:border-blue-500 transition-all overflow-hidden group cursor-pointer h-64">
      <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full z-20">
        {count}+
      </div>
      
      <div className="text-blue-500 mb-4 text-5xl">
        {icon}
      </div>
      
      <h3 className="text-blue-500 font-bold text-xl mb-2">{title}</h3>
      
      <p className="text-gray-300 text-sm text-center">{description}</p>
      
      <Link 
        to={`/category/${id}`} 
        className="absolute inset-0 z-10"
        aria-label={`View ${title} category`}
      />
    </div>
  );
};

export default CategoryCard; 