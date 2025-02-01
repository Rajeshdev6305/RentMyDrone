import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'; // Import SweetAlert2

const MainBody = ({
  isLoggedIn,
  setCartItems,
  cartItems,
  products,
  searchTerm,
  currentUserEmail,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  // Load cart items from localStorage on component mount
  useEffect(() => {
    if (isLoggedIn) {
      const storedCartItems = JSON.parse(localStorage.getItem(`cartItems_${currentUserEmail}`)) || [];
      setCartItems(storedCartItems);
    }
    setLoading(false); // Set loading to false after cart items are loaded
  }, [setCartItems, currentUserEmail, isLoggedIn]);

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Filter products based on search term and selected category
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "All" || product.category === selectedCategory)
  );

  // Add product to cart
  const handleAddToCart = (product) => {
    const existingCartItem = cartItems.find((item) => item.id === product.id);
    let updatedCartItems;
    if (existingCartItem) {
      updatedCartItems = cartItems.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: item.quantity + 1,
              totalPrice: item.totalPrice + product.pricePerDay,
            }
          : item
      );
    } else {
      updatedCartItems = [
        ...cartItems,
        { ...product, quantity: 1, totalPrice: product.pricePerDay },
      ];
    }
    setCartItems(updatedCartItems);
    localStorage.setItem(`cartItems_${currentUserEmail}`, JSON.stringify(updatedCartItems));
    Swal.fire('Success', `Added ${product.name} to cart!`, 'success');
  };

  // View product details
  const handleViewDetails = (product) => {
    if (!isLoggedIn) {
      Swal.fire('Error', 'Please log in to view product details.', 'error');
      navigate("/login");
    } else {
      navigate(`/product/${product.id}`, { state: { product } });
    }
  };

  // Category data for hero section
  const categoryText = {
    Marriage: {
      title: "Drones for Marriage",
      description: "Capture beautiful moments with wedding drone services.",
    },
    "Food Delivery": {
      title: "Drones for Food Delivery",
      description: "Efficient delivery of meals right to your doorstep.",
    },
    Farming: {
      title: "Drones in Farming",
      description: "Revolutionizing agriculture with aerial technology.",
    },
    All: {
      title: "Diverse Drone Applications",
      description: "Explore how drones are revolutionizing various industries.",
    },
  };

  const categoryImages = {
    All: "https://img.freepik.com/premium-photo/drone-flying-modern-cityscape-sunset-ai-generated-image_548729-4502.jpg",
    Marriage: "https://img.freepik.com/premium-photo/photo-drone-with-camera-remote-control-aerial-photography_933496-28343.jpg",
    "Food Delivery":
      "https://files.oaiusercontent.com/file-KP9VxT7U6L8tYKUMtqZzme?se=2025-01-30T22%3A03%3A09Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D89ca11ab-6624-4b3e-8f70-d62dc06414f2.webp&sig=e/2ppHcUf%2Bcs/ADlyPHgf370VXWBxjQanvnJ%2BwjSPIA%3D",
    Farming: "https://img.freepik.com/premium-photo/drone-spraying-crops-sunrise_718046-8379.jpg",
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-[450px] overflow-hidden">
        <img
          src={categoryImages[selectedCategory]}
          alt={selectedCategory}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center text-white p-4">
          <h1 className="text-4xl font-bold mb-4">
            {categoryText[selectedCategory].title}
          </h1>
          <p className="text-lg max-w-2xl">
            {categoryText[selectedCategory].description}
          </p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex justify-center space-x-4 py-8 bg-white shadow-sm">
        {["All", "Marriage", "Food Delivery", "Farming"].map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              selectedCategory === category
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-8">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white border rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105"
          >
            <img
              src={
                product.image.startsWith("data:image")
                  ? product.image
                  : `${process.env.PUBLIC_URL}/${product.image}`
              }
              alt={product.name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2">
                {product.description}
              </p>
              <p className="text-blue-600 font-bold">
                ${product.pricePerDay} per day
              </p>
              <p className="text-gray-500 text-xs mb-2">
                Category: {product.category}
              </p>
              <p className="text-gray-500 text-xs">Model: {product.model}</p>
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => handleViewDetails(product)}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainBody;
