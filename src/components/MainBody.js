import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MainBody = ({
  isLoggedIn,
  setCartItems,
  cartItems,
  products,
  searchTerm,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCategories, setShowCategories] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(storedCartItems);
  }, [setCartItems]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setShowCategories(false);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "All" || product.category === selectedCategory)
  );

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
    if (!isLoggedIn) {
      alert("Please log in to view product details.");
      navigate("/login");
    } else {
      navigate(`/product/${product.id}`, { state: { product } });
    }
  };

  return (
    <div className="">
      <h2 className="text-xl font-bold mb-4">
        Welcome to Drone Delivery Service
      </h2>
      <p className="text-sm mb-4">
        Explore our range of high-quality drones available for delivery.
      </p>
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setShowCategories(!showCategories)}
          className="bg-blue-600 text-white px-2 py-1 text-sm rounded hover:bg-blue-700 transition"
        >
          Select Category
        </button>
      </div>
      {showCategories && (
        <div className="flex justify-center mb-4 space-x-2">
          <button
            onClick={() => handleCategoryChange("All")}
            className={`px-2 py-1 text-sm rounded ${
              selectedCategory === "All"
                ? "text-blue-600"
                : "hover:text-gray-700 transition"
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleCategoryChange("Marriage")}
            className={`px-2 py-1 text-sm rounded ${
              selectedCategory === "Marriage"
                ? "text-blue-600"
                : "hover:text-gray-700 transition"
            }`}
          >
            Marriage
          </button>
          <button
            onClick={() => handleCategoryChange("Food Delivery")}
            className={`px-2 py-1 text-sm rounded ${
              selectedCategory === "Food Delivery"
                ? "text-blue-600"
                : "hover:text-gray-700 transition"
            }`}
          >
            Food Delivery
          </button>
          <button
            onClick={() => handleCategoryChange("Farming")}
            className={`px-2 py-1 text-sm rounded ${
              selectedCategory === "Farming"
                ? "text-blue-600"
                : "hover:text-gray-700 transition"
            }`}
          >
            Farming
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="border p-4 shadow hover:shadow-lg rounded-lg transition"
          >
            <img
              src={
                product.image.startsWith("data:image")
                  ? product.image
                  : `${process.env.PUBLIC_URL}/${product.image}`
              }
              alt={product.name}
              className="w-full h-64 object-cover mb-2 rounded"
            />
            <h3 className="text-lg font-bold">{product.name}</h3>
            <p className="text-sm">{product.description}</p>
            <p className="text-sm text-blue-600 font-bold">
              ${product.pricePerDay} per day
            </p>
            <p className="text-xs text-gray-600">{product.category}</p>
            <p className="text-xs text-gray-600">Model: {product.model}</p>
            {!isLoggedIn && (
              <button
                onClick={() => handleViewDetails(product)}
                className="bg-blue-600 text-white px-2 py-1 text-sm rounded-lg mt-2 w-full hover:bg-blue-700 transition"
              >
                View Details
              </button>
            )}
            <button
              onClick={() => handleAddToCart(product)}
              className="bg-green-600 text-white px-2 py-1 text-sm rounded-lg mt-2 w-full hover:bg-green-700 transition"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainBody;
