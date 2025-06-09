// import React xfrom "react";
import CategoryList from "./CategoryList";

const DiscoverCategories = () => {
  return (
    <div className="bg-[#0a0e21] pt-[120px] py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Discover By Category
          </h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Find the perfect event that matches your interests and vibe
          </p>
        </div>

        <CategoryList />
      </div>
    </div>
  );
};

export default DiscoverCategories;
