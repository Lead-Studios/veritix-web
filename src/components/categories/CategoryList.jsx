import React from "react";
import CategoryCard from "./CategoryCard";
import { categories } from "../../data/categoryData";

const CategoryList = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
  );
};

export default CategoryList; 