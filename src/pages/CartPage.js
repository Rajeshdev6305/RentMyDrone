import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { auth } from "../Authentication/firebaseConfig";
import { FaArrowLeft, FaTrash, FaShoppingCart, FaPlus, FaMinus } from "react-icons/fa";

const CartPage = ({ cartItems, setCartItems, currentUserEmail }) => {
  const [loading, setLoading] = useState(true);
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const navigate = useNavigate();

  const getStoredCartItems = () =>
    JSON.parse(localStorage.getItem(`cartItems_${currentUserEmail}`)) || [];

  const storeCartItems = (items) =>
    localStorage.setItem(`cartItems_${currentUserEmail}`, JSON.stringify(items));

  useEffect(() => {
    if (auth.currentUser) {
      const storedItems = getStoredCartItems();
      if (storedItems.length > 0) setCartItems(storedItems);
    }
    setLoading(false);
  }, [setCartItems, currentUserEmail]);

  useEffect(() => {
    storeCartItems(cartItems);
  }, [cartItems, currentUserEmail]);

  const handleRemoveItem = (itemId) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
    setSelectedItemIds(selectedItemIds.filter((id) => id !== itemId));
    Swal.fire("Success", "Item removed from cart.", "success");
  };

  const handleRemoveAll = () => {
    setCartItems([]);
    setSelectedItemIds([]);
    Swal.fire("Success", "All items removed from cart.", "success");
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

  const handleViewDetails = (item) => {
    navigate(`/product/${item.id}`, { state: { product: item } });
  };

  const handleSelectItem = (itemId) => {
    setSelectedItemIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItemIds.length === cartItems.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(cartItems.map((item) => item.id));
    }
  };

  const handleProceedToPayment = () => {
    if (selectedItemIds.length === 1) {
      const selectedItem = cartItems.find((item) => item.id === selectedItemIds[0]);
      navigate(`/product/${selectedItem.id}`, { state: { product: selectedItem } });
    } else if (selectedItemIds.length > 1) {
      Swal.fire("Error", "Please select only one item to proceed to payment.", "error");
    } else {
      Swal.fire("Error", "Please select an item to proceed to payment.", "error");
    }
  };

  const totalAmount = selectedItemIds.reduce(
    (total, itemId) => total + cartItems.find((item) => item.id === itemId).totalPrice,
    0
  );

  const totalItems = selectedItemIds.reduce(
    (total, itemId) => total + cartItems.find((item) => item.id === itemId).quantity,
    0
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="absolute inset-0 flex items-center justify-center text-sm text-gray-600">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <FaShoppingCart className="text-6xl text-gray-400 mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty!</h2>
        <p className="text-gray-600 mb-6">Add some drones to get started.</p>
        <button
          onClick={() => navigate("/user-dashboard")}
          className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-all duration-300 shadow-md"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <FaShoppingCart className="mr-2" /> My Cart
        </h1>
        <button
          onClick={() => navigate("/user-dashboard")}
          className="flex items-center bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-300"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={selectedItemIds.length === cartItems.length}
                  onChange={handleSelectAll}
                  className="mr-2"
                />
                Select All ({cartItems.length})
              </label>
              <button
                onClick={handleRemoveAll}
                className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300"
              >
                <FaTrash className="mr-2" /> Remove All
              </button>
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block">
              <table className="w-full table-auto border-collapse">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left"></th>
                    <th className="px-4 py-3 text-left">Product</th>
                    <th className="px-4 py-3 text-left">Price</th>
                    <th className="px-4 py-3 text-left">Quantity</th>
                    <th className="px-4 py-3 text-left">Total</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50 transition-all duration-200">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedItemIds.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-4 py-4 flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md cursor-pointer hover:opacity-80 transition-all duration-200"
                          onClick={() => handleViewDetails(item)}
                        />
                        <span className="text-sm font-semibold text-gray-800">{item.name}</span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">₹{item.pricePerDay}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2 bg-gray-100 rounded-full p-1">
                          <button
                            onClick={() => handleDecreaseQuantity(item.id)}
                            className="p-1 text-gray-600 hover:text-gray-800 transition-all duration-200"
                          >
                            <FaMinus />
                          </button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleIncreaseQuantity(item.id)}
                            className="p-1 text-gray-600 hover:text-gray-800 transition-all duration-200"
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-gray-800">
                        ₹{item.totalPrice.toFixed(2)}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="flex items-center bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all duration-200 text-xs"
                        >
                          <FaTrash className="mr-1" /> Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Cards */}
            <div className="lg:hidden space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedItemIds.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                    />
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md cursor-pointer hover:opacity-80 transition-all duration-200"
                      onClick={() => handleViewDetails(item)}
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-600">₹{item.pricePerDay}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center space-x-2 bg-gray-100 rounded-full p-1">
                      <button
                        onClick={() => handleDecreaseQuantity(item.id)}
                        className="p-1 text-gray-600 hover:text-gray-800 transition-all duration-200"
                      >
                        <FaMinus />
                      </button>
                      <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleIncreaseQuantity(item.id)}
                        className="p-1 text-gray-600 hover:text-gray-800 transition-all duration-200"
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">₹{item.totalPrice.toFixed(2)}</p>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all duration-200 text-xs"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Cart Summary</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span className="font-medium">Selected Items:</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total Amount:</span>
                <span className="font-bold text-gray-800">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleProceedToPayment}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all duration-300 mt-6 font-semibold"
            >
              Proceed to Payment
            </button>
            <button
              onClick={() => navigate("/user-dashboard")}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 mt-3 font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;