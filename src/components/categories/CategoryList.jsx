import React from "react";
import CategoryCard from "./CategoryCard";
import { categories } from "../../data/categoryData";

const CategoryList = () => {
  return (
    <>
      {/* Mobile view - horizontal scrollable */}
      <div className="sm:hidden overflow-x-auto pb-4 no-scrollbar">
        <div className="flex space-x-4 px-2 w-max">
          {categories.map((category) => (
            <div key={category.id} className="w-[160px] flex-shrink-0">
              <CategoryCard 
                id={category.id}
                icon={<category.icon />}
                title={category.name}
                description={category.description}
                count={category.count}
                events={category.events}
                isMobile={true}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Desktop view - grid layout */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <CategoryCard 
            key={category.id}
            id={category.id}
            icon={<category.icon />}
            title={category.name}
            description={category.description}
            count={category.count}
            events={category.events}
          />
        ))}
      </div>
    </>
  );
};

export default CategoryList; 