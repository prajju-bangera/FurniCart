import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import "./ProductDetails.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import ImgZoom from "react-img-zoom";
import { useCart } from "../components/CartContext";
import { FaTruck } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [gstRate] = useState(18); // Default GST Rate
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/products/${productId}`);
        setProduct(response.data);
        setSelectedImage(response.data.mainImage);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  if (!product) return <h2>Loading...</h2>;

  const handleIncrease = () => setQuantity((prev) => Math.min(prev + 1, 5));
  const handleDecrease = () => setQuantity((prev) => Math.max(prev - 1, 1));

  const gstAmount = (product.discountPrice * gstRate) / 100;
  const finalPriceWithGst = product.discountPrice + gstAmount;

  const handleAddToCart = () => {
    if (!product) return;

    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="product-details-container">
      <div className="product-images">
        <div className="zoom-container">
          {selectedImage && <ImgZoom key={selectedImage} img={selectedImage} zoomScale={2} width={400} height={400} />}
        </div>
        <div className="thumbnail-gallery">
          <img src={product.mainImage} alt="Main" className={`thumbnail ${selectedImage === product.mainImage ? "active" : ""}`} onClick={() => setSelectedImage(product.mainImage)} />
          {Array.isArray(product.subImages) && product.subImages.map((img, index) => (
            <img key={index} src={img} alt={`Sub ${index + 1}`} className={`thumbnail ${selectedImage === img ? "active" : ""}`} onClick={() => setSelectedImage(img)} />
          ))}
        </div>
      </div>

      <div className="product-info">
        <h1>{product.name}</h1>
        <h3 className="special-price">Special Price</h3>
        <h2 className="discount-price">
          ₹{product.discountPrice}
          <span className="actual-price"> ₹{product.price}</span>
          <span className="discount-percentage">({Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF)</span>
        </h2>
        <div className="rating-stars">
          {[...Array(4)].map((_, i) => (<FontAwesomeIcon key={i} icon={faStar} className="star full-star" />))}
          <FontAwesomeIcon icon={faStarHalfAlt} className="star half-star" />
        </div>
        <h3 className="desc-heading">Description</h3>
        <p className="description">{product.description}</p>
        <div className="quantity-container">
          <label><strong>Quantity:</strong></label>
          <div className="quantity-selector">
            <button onClick={handleDecrease}>−</button>
            <span>{quantity}</span>
            <button onClick={handleIncrease}>+</button>
          </div>
        </div>
        <div className="gst-price">
          <h3>GST ({gstRate}%): ₹{gstAmount.toFixed(2)}</h3>
          <h4>Final Price (incl. GST): <span>₹{finalPriceWithGst.toFixed(2)}</span></h4>
        </div>
        <button onClick={handleAddToCart} className="add-to-cart-btn">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;