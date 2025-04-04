import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaRegHeart, FaSearch, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import "./book.css";

const Bookshelf = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [wishlist, setWishlist] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [sortOption, setSortOption] = useState("newest");
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const bookshelfTypes = [
    "All",
    "Standing",
    "Wall-Mounted",
    "Corner",
    "Ladder",
    "Cube",
  ];

  const priceRanges = [
    { label: "Below 10k", min: 0, max: 10000 },
    { label: "10k-20k", min: 10000, max: 20000 },
    { label: "20k-30k", min: 20000, max: 30000 },
    { label: "30k-40k", min: 30000, max: 40000 },
    { label: "40k-50k", min: 40000, max: 50000 },
    { label: "50k-80k", min: 50000, max: 80000 },
    { label: "Above 1 Lakh", min: 100000, max: Infinity },
  ];

  useEffect(() => {
    fetchProducts();
    loadWishlist();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedType, selectedPriceRanges, sortOption]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/products");
      const bookshelfProducts = response.data.filter(
        (prod) => prod.category?.trim().toLowerCase() === "bookshelf"
      );
      setProducts(bookshelfProducts);
      setFilteredProducts(sortProducts(bookshelfProducts, sortOption));
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadWishlist = () => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || {};
    setWishlist(storedWishlist);
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) => ({ ...prev, [productId]: !prev[productId] }));
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleTypeClick = (type) => {
    setSelectedType(type);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handlePriceChange = (label) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  const applyFilters = () => {
    let filtered = products;

    if (selectedType !== "All") {
      filtered = filtered.filter((product) => product.type === selectedType);
    }

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery)
      );
    }

    if (selectedPriceRanges.length > 0) {
      filtered = filtered.filter((product) =>
        selectedPriceRanges.some((label) => {
          const range = priceRanges.find((r) => r.label === label);
          return (
            range &&
            product.discountPrice >= range.min &&
            product.discountPrice <= range.max
          );
        })
      );
    }

    setFilteredProducts(sortProducts(filtered, sortOption));
  };

  const sortProducts = (products, option) => {
    let sortedProducts = [...products];

    switch (option) {
     
      case "highToLow":
        sortedProducts.sort((a, b) => b.discountPrice - a.discountPrice);
        break;
      case "lowToHigh":
        sortedProducts.sort((a, b) => a.discountPrice - b.discountPrice);
        break;
      case "mostLiked":
        sortedProducts.sort((a, b) => (wishlist[b._id] ? 1 : 0) - (wishlist[a._id] ? 1 : 0));
        break;
      default:
        break;
    }

    return sortedProducts;
  };

  function RatingStars({ rating }) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} />);
    }

    return <div>{stars}</div>;
  }

  return (
    <div className="category-page">
      <div className="top-container">
        <form className="search-container" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Search bookshelves..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <FaSearch />
          </button>
        </form>
      </div>

      <div className="sort-container">
        <label>Sort By:</label>
        <select
          className="sort-dropdown"
          value={sortOption}
          onChange={handleSortChange}
        >
         
          <option value="highToLow">Price: High to Low</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="mostLiked">Most Liked</option>
        </select>
      </div>

      <div className="main-content">
        <div className="filters">
          <div className="filter-container">
            <label>Bookshelf Type:</label>
            <div className="type-links">
              {bookshelfTypes.map((type) => (
                <span
                  key={type}
                  className={`type-link ${
                    selectedType === type ? "active" : ""
                  }`}
                  onClick={() => handleTypeClick(type)}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          <div className="filter-container">
            <label>Price Range:</label>
            {priceRanges.map((range) => (
              <div key={range.label} className="price-checkbox">
                <input
                  type="checkbox"
                  id={range.label}
                  checked={selectedPriceRanges.includes(range.label)}
                  onChange={() => handlePriceChange(range.label)}
                />
                <label htmlFor={range.label}>{range.label}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="products-container">
                 <h2>BookShelfs</h2>
                 <div className="product-grid">
                   {filteredProducts.length > 0 ? (
                     filteredProducts.map((product) => (
                       <div key={product._id} className="product-card">
                         <div className="wishlist-icon" onClick={() => toggleWishlist(product._id)}>
                           {wishlist[product._id] ? <FaHeart className="heart-icon active" /> : <FaRegHeart className="heart-icon" />}
                         </div>
                         <img src={product.mainImage} alt={product.name} className="product-image" />
                         <h4>{product.name}</h4>
                         <div className="price">
                           <span className="discount-price">₹{product.discountPrice}</span>
                           <span className="original-price">₹{product.price}</span>
                         </div>
       
       
                         <div className="rating">
                       <FaStar /><FaStar /><FaStar /><FaStar /><FaStarHalfAlt />
                     </div>
                     <p className="short-description">{product.description.split(" ").slice(0, 20).join(" ")}...</p>
                     <button
         className={`view-details ${!product.isAvailable ? "out-of-stock" : ""}`}
         onClick={() => handleViewDetails(product._id)}
         disabled={!product.isAvailable}
       >
         {product.isAvailable ? "ADD TO CART" : "OUT OF STOCK"}
       </button>
       
                   </div>
                     ))
                   ) : (
                     <p>No products found.</p>
                   )}
                 </div>
               </div>
             </div>
           </div>
         );
       };
       export default Bookshelf;
