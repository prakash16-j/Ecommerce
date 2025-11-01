import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate(); // 2. Initialize the navigation hook

  // Handler for Add to Cart
  const handleAddToCart = (e) => {
    // Prevents navigation and stops the click from bubbling up to the card's Link
    e.preventDefault(); 
    e.stopPropagation();
    addToCart(product);
    console.log('Added to cart:', product.title);
  };
  
  // Handler for Buy Now
  const handleBuyNow = (e) => {
    // 3. Prevent navigation and stop event propagation
    e.preventDefault(); 
    e.stopPropagation();
    
    // 4. Add to cart (the quantity logic is handled in CartContext)
    addToCart(product); 
    
    // 5. Immediately navigate to the cart/checkout page
    navigate('/user/cart'); 
  };

  return (
    <Link to={`/user/product/${product.id}`} className="block">
      <div className="w-64 border border-gray-200 rounded-lg shadow-lg p-4 flex flex-col justify-between text-center bg-white hover:shadow-xl transition-shadow">
        
        {/* Product Details (Image, Title, Price) */}
        <div>
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-48 object-contain mb-4" 
          />
          <h3 className="text-base font-semibold text-gray-800 h-12 overflow-hidden mb-2">
            {product.title}
          </h3>
          <p className="text-lg font-bold text-gray-900 mb-4">
            ${product.price.toFixed(2)}
          </p>
        </div>
        
        {/* Buttons: Added a flex container for two buttons */}
        <div className="flex space-x-2">
            
          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-blue-600 text-white px-2 py-2 rounded-lg hover:bg-blue-700 transition-colors z-10 relative text-sm"
          >
            Add to Cart
          </button>
          
          <button 
            onClick={handleBuyNow}
            className="flex-1 bg-green-500 text-white px-2 py-2 rounded-lg hover:bg-green-600 transition-colors z-10 relative text-sm"
          >
            Buy Now
          </button>
          
        </div>
      </div>
    </Link>
  );
};

export default ProductCard; 