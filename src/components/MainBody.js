import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MainBody = ({ isLoggedIn, setCartItems, cartItems, products, searchTerm }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(storedCartItems);
  }, [setCartItems]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
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
      updatedCartItems = [...cartItems, { ...product, quantity: 1, totalPrice: product.pricePerDay }];
    }
    setCartItems(updatedCartItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
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

  const categoryText = {
    Marriage: {
      title: "Drones for Marriage",
      description: "Capture beautiful moments with wedding drone services."
    },
    "Food Delivery": {
      title: "Drones for Food Delivery",
      description: "Efficient delivery of meals right to your doorstep."
    },
    Farming: {
      title: "Drones in Farming",
      description: "Revolutionizing agriculture with aerial technology."
    },
    All: {
      title: "Diverse Drone Applications",
      description: "Explore how drones are revolutionizing various industries."
    }
  };

  const categoryImages = {
    Marriage: "https://img.freepik.com/free-photo/wedding-drones-photography_1150-2443.jpg",
    "Food Delivery": "https://img.freepik.com/free-photo/drone-delivery-food-box_1150-797.jpg",
    Farming: "https://img.freepik.com/free-photo/drone-farming-agriculture_1150-12955.jpg",
    All: "https://img.freepik.com/premium-photo/delivery-drone-online-delivery-concept-sydney-opera-house-ai-generated_599862-1237.jpg"
  };

  return (
    <div>
      {/* Hero Section with Scrollable Images */}
      <div className="relative w-full h-[450px] overflow-hidden">
        <img
          src={categoryImages[selectedCategory]}
          alt={selectedCategory}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center text-white p-4">
          <h1 className="text-4xl font-bold">{categoryText[selectedCategory].title}</h1>
          <p className="text-lg mt-2">{categoryText[selectedCategory].description}</p>
        </div>
      </div>

      {/* Categories */}
      <div className="flex justify-center space-x-4 py-6">
        {["All", "Marriage", "Food Delivery", "Farming"].map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              selectedCategory === category ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 pb-12">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white border rounded-lg shadow-lg p-4 hover:shadow-2xl transition transform hover:scale-105">
            <img
              src={
                product.image.startsWith("data:image")
                  ? product.image
                  : `${process.env.PUBLIC_URL}/${product.image}`
              }
              alt={product.name}
              className="w-full h-64 object-cover rounded-md"
            />
            <h3 className="text-lg font-semibold mt-3">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-2">{product.description}</p>
            <p className="text-blue-600 font-bold">${product.pricePerDay} per day</p>
            <p className="text-gray-500 text-xs">Category: {product.category}</p>
            <p className="text-gray-500 text-xs">Model: {product.model}</p>
            <button
              onClick={() => handleViewDetails(product)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-3 w-full hover:bg-blue-700 transition"
            >
              View Details
            </button>
            <button
              onClick={() => handleAddToCart(product)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg mt-2 w-full hover:bg-green-700 transition"
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
