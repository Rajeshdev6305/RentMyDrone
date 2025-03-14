import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCartPlus, FaInfoCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

const UserDashboard = ({
  setIsLoggedIn,
  setCartItems,
  cartItems,
  currentUserEmail,
}) => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Load products from localStorage
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(storedProducts);

    // Load cart items
    const storedCartItems =
      JSON.parse(localStorage.getItem(`cartItems_${currentUserEmail}`)) || [];
    setCartItems(storedCartItems);

    setLoading(false);

    // Listen for storage changes from other tabs
    const handleStorageChange = (e) => {
      if (e.key === "products") {
        const updatedProducts = JSON.parse(e.newValue) || [];
        setProducts(updatedProducts);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
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
    navigate(`/product/${product.id}`, {
      state: { product, currentUserEmail },
    });
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
    Marriage:
      "https://img.freepik.com/premium-photo/photo-drone-with-camera-remote-control-aerial-photography_933496-28343.jpg",
    "Food Delivery":
      "https://img.freepik.com/premium-photo/delivery-drone-flying-with-cityscape-background-generative-ai_175949-1134.jpg",
    Farming:
      "https://img.freepik.com/premium-photo/drone-spraying-crops-sunrise_718046-8379.jpg",
  };

  const categoryTexts = {
    All: "Discover drones for every adventure!",
    Marriage: "Capture your big day from the sky!",
    "Food Delivery": "Fast. Fresh. Fly-in Delivery!",
    Farming: "Precision farming, elevated!",
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.div
          className="rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-600"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="relative bg-gray-50 min-h-screen">
      <header className="sticky top-0 z-20 bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-extrabold text-blue-700"
        >
          RentMyDrone
        </motion.h1>
      </header>

      <motion.div
        key={selectedCategory}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8"
        style={{
          backgroundImage: `url(${categoryImages[selectedCategory]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "500px",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
        <div className="relative z-10 text-white text-center py-16 flex flex-col justify-center items-center h-full">
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold drop-shadow-lg"
          >
            {categoryTexts[selectedCategory]}
          </motion.h2>
        </div>
      </motion.div>

      <div className="flex justify-center mb-8 space-x-4 px-4">
        {["All", "Marriage", "Food Delivery", "Farming"].map((category) => (
          <motion.button
            key={category}
            onClick={() => handleCategoryChange(category)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              selectedCategory === category
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {category}
          </motion.button>
        ))}
      </div>

      <div className="px-6 py-8">
        <h3 className="text-2xl font-semibold mb-6 text-gray-800">
          Available Drones
        </h3>
        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500">No products available.</p>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="border p-4 bg-white shadow-md rounded-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => handleViewDetails(product)}
                >
                  <img
                    src={
                      product.image && product.image.startsWith("data:image")
                        ? product.image
                        : `${process.env.PUBLIC_URL}/${product.image || "fallback-image.jpg"}`
                    }
                    alt={product.name}
                    className="w-full h-64 object-cover mb-4 rounded-lg"
                    onError={(e) => (e.target.src = "/fallback-image.jpg")}
                  />
                  <h3 className="text-lg font-semibold text-gray-800">
                    {product.name || "Unnamed Product"}
                  </h3>
                  <p className="text-sm text-gray-500">{product.category || "Uncategorized"}</p>
                  <p className="text-sm text-blue-600 font-bold mt-1">
                    ₹{product.pricePerDay ? product.pricePerDay.toLocaleString() : "N/A"} / day
                  </p>
                  <div className="flex justify-between mt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="bg-green-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
                    >
                      <FaCartPlus />
                      <span>Add to Cart</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(product);
                      }}
                      className="bg-blue-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
                    >
                      <FaInfoCircle />
                      <span>Details</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;