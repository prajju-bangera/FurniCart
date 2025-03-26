import React from "react";
import "./category.css";

const categories = [
  { id: 1, name: "Sofas Sets", image: "https://cdn-icons-png.flaticon.com/128/13714/13714668.png" },
  { id: 2, name: "Bean Bags", image: "https://cdn-icons-png.flaticon.com/128/1698/1698755.png" },
  { id: 3, name: "Chairs", image: "https://cdn-icons-png.flaticon.com/128/2271/2271438.png" },
  { id: 4, name: "Shoe Racks", image: "https://cdn-icons-png.flaticon.com/128/8653/8653764.png" },
  { id: 5, name: "Bedroom Sets", image: "https://cdn-icons-png.flaticon.com/128/15938/15938667.png" },
  { id: 6, name: "Dining Sets", image: "https://cdn-icons-png.flaticon.com/128/13715/13715099.png" },
  { id: 7, name: "Study Tables", image: "https://cdn-icons-png.flaticon.com/128/3273/3273259.png" },
  { id: 8, name: "Wardrobes", image: "https://cdn-icons-png.flaticon.com/128/1237/1237773.png" },
  { id: 9, name: "Book Shelfs", image: "  https://cdn-icons-png.flaticon.com/128/2570/2570015.png" },
];

const CategoryButtons = () => {
  return (
    <div className="category-container">
      <h2>Shop by Categories</h2>
      <div className="category-grid">
        {categories.map((category) => (
          <button key={category.id} className="category-button">
            <img src={category.image} alt={category.name} />
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryButtons;
