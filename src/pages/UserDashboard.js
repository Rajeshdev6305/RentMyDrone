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

  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">User Dashboard</h1>
        {/* <div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-2 py-1 text-sm rounded hover:bg-red-700 transition flex items-center space-x-2"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div> */}
      </header>
      <div className="flex justify-center mb-4 space-x-2">
        <button
          onClick={() => handleCategoryChange("All")}
          className={`px-2 py-1 text-sm rounded ${
            selectedCategory === "All"
              ? "text-white-600"
              : "bg-blue-600 text-white px-2 py-1 text-sm rounded hover:bg-blue-700 transition flex items-center space-x-2"
          }`}
        >
          All
        </button>
        <button
          onClick={() => handleCategoryChange("Marriage")}
          className={`px-2 py-1 text-sm rounded ${
            selectedCategory === "Marriage"
              ? "text-white-600"
              : "bg-blue-600 text-white px-2 py-1 text-sm rounded hover:bg-blue-700 transition flex items-center space-x-2"
          }`}
        >
          Marriage
        </button>
        <button
          onClick={() => handleCategoryChange("Food Delivery")}
          className={`px-2 py-1 text-sm rounded ${
            selectedCategory === "Food Delivery"
              ? "text-white-600"
              : "bg-blue-600 text-white px-2 py-1 text-sm rounded hover:bg-blue-700 transition flex items-center space-x-2"
          }`}
        >
          Food Delivery
        </button>
        <button
          onClick={() => handleCategoryChange("Farming")}
          className={`px-2 py-1 text-sm rounded ${
            selectedCategory === "Farming"
              ? "text-white-600"
              : "bg-blue-600 text-white px-2 py-1 text-sm rounded hover:bg-blue-700 transition flex items-center space-x-2"
          }`}
        >
          Farming
        </button>
      </div>
      <h2 className="text-xl font-bold mb-4">Available Drones</h2>
      {Object.keys(groupedProducts).map((category) => (
        <div key={category}>
          <h3 className="text-lg font-bold mb-4">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts
              .filter((product) => product.category === category)
              .map((product) => (
                <div
                  key={product.id}
                  className="border p-4 shadow hover:shadow-lg rounded-lg transition cursor-pointer"
                  onClick={() => handleViewDetails(product)}
                >
                  <img
                    src={product.image.startsWith('data:image') ? product.image : `${process.env.PUBLIC_URL}/${product.image}`}
                    alt={product.name}
                    className="w-full h-64 object-cover mb-2 rounded"
                  />
                  <h3 className="text-lg font-bold">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.category}</p>
                  <p className="text-sm text-blue-600 font-bold">
                    ${product.pricePerDay} per day
                  </p>
                  <div className="flex justify-between mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="bg-green-600 text-white px-2 py-1 text-sm rounded hover:bg-green-700 transition flex items-center space-x-2"
                    >
                      <FaCartPlus />
                      <span>Add to Cart</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(product);
                      }}
                      className="bg-blue-600 text-white px-2 py-1 text-sm rounded hover:bg-blue-700 transition flex items-center space-x-2"
                    >
                      <FaInfoCircle />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserDashboard;
