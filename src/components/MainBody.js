import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const MainBody = ({
  isLoggedIn,
  setCartItems,
  cartItems,
  products,
  searchTerm,
  currentUserEmail,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      const storedCartItems =
        JSON.parse(localStorage.getItem(`cartItems_${currentUserEmail}`)) || [];
      setCartItems(storedCartItems);
    }
    setLoading(false);
  }, [setCartItems, currentUserEmail, isLoggedIn]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "All" || product.category === selectedCategory)
  );

  const handleAddToCart = (product) => {
    if (!isLoggedIn) {
      Swal.fire("Error", "Please log in to add items to the cart.", "error");
      navigate("/login");
      return;
    }
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
    localStorage.setItem(
      `cartItems_${currentUserEmail}`,
      JSON.stringify(updatedCartItems)
    );
    Swal.fire({
      icon: "success",
      title: "Added to Cart!",
      text: `${product.name} has been added to your cart.`,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleViewDetails = (product) => {
    if (!isLoggedIn) {
      Swal.fire("Error", "Please log in to view product details.", "error");
      navigate("/login");
    } else {
      navigate(`/product/${product.id}`, { state: { product } });
    }
  };

  const categoryText = {
    Marriage: {
      title: "Drones for Marriage",
      description: "Capture stunning wedding moments with drone technology.",
    },
    "Food Delivery": {
      title: "Food Delivery Drones",
      description: "Fast, reliable meal delivery straight to you.",
    },
    Farming: {
      title: "Farming Drones",
      description: "Transform agriculture with aerial precision.",
    },
    All: {
      title: "Explore Drone Solutions",
      description: "Innovative drone applications for every need.",
    },
  };

  const categoryImages = {
    All: "https://img.freepik.com/premium-photo/drone-flying-modern-cityscape-sunset-ai-generated-image_548729-4502.jpg",
    Marriage:
      "https://img.freepik.com/premium-photo/photo-drone-with-camera-remote-control-aerial-photography_933496-28343.jpg",
    "Food Delivery":
      "https://img.freepik.com/premium-photo/delivery-drone-flying-with-cityscape-background-generative-ai_175949-1134.jpg",
    Farming:
      "https://img.freepik.com/premium-photo/drone-spraying-crops-sunrise_718046-8379.jpg",
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-[500px] overflow-hidden">
        <img
          src={categoryImages[selectedCategory]}
          alt={selectedCategory}
          className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-center items-center text-center text-white p-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 animate-fade-in-down">
            {categoryText[selectedCategory].title}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl animate-fade-in-up">
            {categoryText[selectedCategory].description}
          </p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex justify-center flex-wrap gap-4 py-8 px-4 bg-white shadow-md sticky top-0 z-10">
        {["All", "Marriage", "Food Delivery", "Farming"].map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 transform hover:-translate-y-1 ${
              selectedCategory === category
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-8">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white border rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <div className="relative overflow-hidden rounded-t-xl">
              <img
                src={
                  product.image.startsWith("data:image")
                    ? product.image
                    : `${process.env.PUBLIC_URL}/${product.image}`
                }
                alt={product.name}
                className="w-full h-56 object-cover transition-transform duration-500 hover:scale-110"
              />
              <span className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                {product.category}
              </span>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">
                {product.name}
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.description}
              </p>
              <div className="flex justify-between items-center mb-4">
                <p className="text-indigo-600 font-bold text-lg">
                  ₹{product.pricePerDay} / day
                </p>
                <p className="text-gray-500 text-xs">Model: {product.model}</p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleViewDetails(product)}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
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