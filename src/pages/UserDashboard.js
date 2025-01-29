import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaCartPlus, FaInfoCircle } from "react-icons/fa";

const UserDashboard = ({
  setIsLoggedIn,
  setCartItems,
  cartItems,
  products,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(storedCartItems);
  }, [setCartItems]);

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
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems)); // Store cart items in local storage
    alert(`Added ${product.name} to cart!`);
  };

  const handleViewDetails = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const categoryImages = {
    All: "https://img.freepik.com/premium-photo/topdown-view-delivery-drone-with-new-cityscape-background-ai_894067-1262.jpg",
    Marriage: "/images/marriage-category.jpg",
    "Food Delivery": "/images/food-delivery-category.jpg",
    Farming: "/images/farming-category.jpg",
  };

  const categoryTexts = {
    All: "Explore all our drones for different use cases!",
    Marriage: "Drone photography for your big day!",
    "Food Delivery": "Fast, efficient, and reliable food delivery drones.",
    Farming: "Smart drones to help in your farming operations.",
  };

  return (
    <div className="relative">
      {/* Top Category Section with Background Image */}
      <div
        className="relative mb-6"
        style={{
          backgroundImage: `url(${categoryImages[selectedCategory]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "400px", // Increased height from 250px to 400px
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 text-white text-center py-10">
          <h2 className="text-3xl font-bold">{categoryTexts[selectedCategory]}</h2>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="px-4 py-6">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">User Dashboard</h1>
        </header>

        {/* Category Buttons */}
        <div className="flex justify-center mb-4 space-x-2">
          {["All", "Marriage", "Food Delivery", "Farming"].map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Available Drones */}
        <h3 className="text-xl font-semibold mb-4">Available Drones</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border p-4 shadow-md rounded-lg transition-transform transform hover:scale-105 cursor-pointer"
              onClick={() => handleViewDetails(product)}
            >
              <img
                src={
                  product.image.startsWith("data:image")
                    ? product.image
                    : `${process.env.PUBLIC_URL}/${product.image}`
                }
                alt={product.name}
                className="w-full h-64 object-cover mb-3 rounded-lg"
              />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-300">{product.category}</p>
              <p className="text-sm text-blue-600 font-bold">
                ${product.pricePerDay} per day
              </p>
              <div className="flex justify-between mt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  className="bg-green-600 text-white px-3 py-1 text-sm rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
                >
                  <FaCartPlus />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(product);
                  }}
                  className="bg-blue-600 text-white px-3 py-1 text-sm rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
                >
                  <FaInfoCircle />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
