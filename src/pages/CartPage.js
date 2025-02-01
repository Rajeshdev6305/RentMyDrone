import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'; // Import SweetAlert2
import { auth } from "../Authentication/firebaseConfig"; // Import auth

const CartPage = ({ cartItems, setCartItems, currentUserEmail }) => {
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  const getStoredCartItems = () => {
    const storedItems = localStorage.getItem(`cartItems_${currentUserEmail}`);
    return storedItems ? JSON.parse(storedItems) : [];
  };

  const storeCartItems = (items) => {
    localStorage.setItem(`cartItems_${currentUserEmail}`, JSON.stringify(items));
  };

  useEffect(() => {
    console.log("auth.currentUser:", auth.currentUser);
    if (auth.currentUser) {
      const storedItems = getStoredCartItems();
      if (storedItems.length > 0) {
        setCartItems(storedItems);
      }
    }
    setLoading(false); // Set loading to false after cart items are loaded
  }, [setCartItems, currentUserEmail, getStoredCartItems]);

  useEffect(() => {
    storeCartItems(cartItems);
  }, [cartItems, currentUserEmail, storeCartItems]);

  const handleRemoveItem = (itemId) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
    Swal.fire('Success', 'Item removed from cart.', 'success');
  };

  const handleRemoveAll = () => {
    setCartItems([]);
    Swal.fire('Success', 'All items removed from cart.', 'success');
  };

  const handleIncreaseQuantity = (itemId) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: item.quantity + 1, totalPrice: item.totalPrice + Number(item.pricePerDay) }
          : item
      )
    );
  };

  const handleDecreaseQuantity = (itemId) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1, totalPrice: item.totalPrice - Number(item.pricePerDay) }
          : item
      )
    );
  };

  const handleViewDetails = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const totalAmount = cartItems.reduce((total, item) => total + Number(item.totalPrice), 0);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty!</h2>
        <button
          onClick={() => navigate("/user-dashboard")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-300 mr-2"
            >
              Back
            </button>
            <button
              onClick={handleRemoveAll}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300"
            >
              Remove All
            </button>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-800">Total Items: {totalItems}</h2>
            <h2 className="text-xl font-bold text-gray-800">Total Price: ${totalAmount.toFixed(2)}</h2>
          </div>
        </div>

        {/* Cart Items Section */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h2>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex"
              onClick={() => handleViewDetails(item)}
            >
              <img
                src={
                  item.image.startsWith("data:image")
                    ? item.image
                    : `${process.env.PUBLIC_URL}/${item.image}`
                }
                alt={item.name}
                className="w-32 h-32 object-cover rounded-lg mr-4"
              />
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-600">Price: ${item.pricePerDay} per day</p>
                <p className="text-sm text-gray-600">Category: {item.category}</p>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-sm text-gray-600">Total Price: ${item.totalPrice.toFixed(2)}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDecreaseQuantity(item.id);
                    }}
                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-300 transition-colors duration-300"
                  >
                    -
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleIncreaseQuantity(item.id);
                    }}
                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-300 transition-colors duration-300"
                  >
                    +
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveItem(item.id);
                    }}
                    className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition-colors duration-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CartPage;