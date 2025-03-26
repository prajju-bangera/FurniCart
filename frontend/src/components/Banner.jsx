import React, { useState, useEffect } from "react";
import "./banner.css";

const slides = [
  {
    id: 1,
    image: "https://static.vecteezy.com/system/resources/thumbnails/004/707/493/small/online-shopping-on-phone-buy-sell-business-digital-web-banner-application-money-advertising-payment-ecommerce-illustration-search-vector.jpg",
    text: "Latest Laptops with Powerful Performance",
    discount: "Flat 30% Off!",
    buttonText: "Explore Laptops",
    link: "/products/Laptop",
  },
  {
    id: 2,
    image: "https://i.pinimg.com/originals/fe/f2/f2/fef2f2ab57f4283af0b0436d1b4a4dd3.png",
    text: "Smartphones with Cutting-Edge Technology",
    discount: "Up to 40% Off!",
    buttonText: "Shop Smartphones",
    link: "/products/Mobile",
  },
  {
    id: 3,
    image: "https://i.pinimg.com/originals/79/fc/1a/79fc1aece0588c1f9c1872d3beacc6ab.jpg",
    text: "Next-Level Smartwatches for a Smarter You",
    discount: "Limited Time Deal: 25% Off",
    buttonText: "Discover Smartwatches",
    link: "/products/Watch",
  },
  {
    id: 4,
    image: "https://www.marketingevolution.com/hubfs/3%20media%20trends%20affecting%20the%20success%20of%20tv%20advertising%20this%20year.jpg",
    text: "Brilliant Colors, Smarter Features - The TV of Tomorrow",
    discount: "Exclusive 50% Off!",
    buttonText: "Browse TVs",
    link: "/products/TV",
  },
  {
    id: 5,
    image: "https://img.freepik.com/premium-photo/set-wireless-headphones-banner-ads-advertising-sound-quality-ima-creative-design-concept-ideas_655090-1106972.jpg",
    text: "Smart Sound, Smarter Experience",
    discount: "Save 35% on Headphones",
    buttonText: "Check Headphones",
    link: "/products/Headphone",
  },
];

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero">
      <div className="slider">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide ${index === currentIndex ? "active" : ""}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="overlay">
              <h2>{slide.text}</h2>
              <p className="discount">{slide.discount}</p>
              <a href={slide.link} className="btn">
                {slide.buttonText}
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
