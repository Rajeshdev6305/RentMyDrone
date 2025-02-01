import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCartPlus, FaInfoCircle } from "react-icons/fa"; // Remove FaSignOutAlt
import Swal from 'sweetalert2'; // Import SweetAlert2

const UserDashboard = ({
  setIsLoggedIn,
  setCartItems,
  cartItems,
  products,
  currentUserEmail,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem(`cartItems_${currentUserEmail}`)) || [];
    setCartItems(storedCartItems);
    setLoading(false); // Set loading to false after data is loaded
  }, [setCartItems, currentUserEmail]);

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
    localStorage.setItem(`cartItems_${currentUserEmail}`, JSON.stringify(updatedCartItems)); // Store cart items in local storage
    Swal.fire('Success', `Added ${product.name} to cart!`, 'success');
  };

  const handleViewDetails = (product) => {
    navigate(`/product/${product.id}`, { state: { product, currentUserEmail } });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const categoryImages = {
    All: "https://img.freepik.com/premium-photo/drone-flying-modern-cityscape-sunset-ai-generated-image_548729-4502.jpg",
    Marriage: "https://img.freepik.com/premium-photo/photo-drone-with-camera-remote-control-aerial-photography_933496-28343.jpg",
    "Food Delivery":
      "https://files.oaiusercontent.com/file-KP9VxT7U6L8tYKUMtqZzme?se=2025-01-30T22%3A03%3A09Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D89ca11ab-6624-4b3e-8f70-d62dc06414f2.webp&sig=e/2ppHcUf%2Bcs/ADlyPHgf370VXWBxjQanvnJ%2BwjSPIA%3D",
    Farming: "https://img.freepik.com/premium-photo/drone-spraying-crops-sunrise_718046-8379.jpg",
  };

  const categoryTexts = {
    All: "Explore all our drones for different use cases!",
    Marriage: "Drone photography for your big day!",
    "Food Delivery": "Fast, efficient, and reliable food delivery drones.",
    Farming: "Smart drones to help in your farming operations.",
  };

  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Top Category Section with Background Image */}
      <div
        className="relative mb-6"
        style={{
          backgroundImage: `url(${categoryImages[selectedCategory]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "500px", // Increased height from 250px to 400px
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 text-white text-center py-10">
          <h2 className="text-3xl font-bold">
            {categoryTexts[selectedCategory]}
          </h2>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="px-4 py-6">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">RentMyDrone</h1>
        </header>

        {/* Category Buttons */}
        <div className="flex justify-center mb-4 space-x-2">
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
