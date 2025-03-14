import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { auth } from "../Authentication/firebaseConfig";

const CartPage = ({ cartItems, setCartItems, currentUserEmail }) => {
  const [loading, setLoading] = useState(true);
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const navigate = useNavigate();

  const getStoredCartItems = () => {
    const storedItems = localStorage.getItem(`cartItems_${currentUserEmail}`);
    return storedItems ? JSON.parse(storedItems) : [];
  };

  const storeCartItems = (items) => {
    localStorage.setItem(`cartItems_${currentUserEmail}`, JSON.stringify(items));
  };

  useEffect(() => {
    if (auth.currentUser) {
      const storedItems = getStoredCartItems();
      if (storedItems.length > 0) {
        setCartItems(storedItems);
      }
    }
    setLoading(false);
  }, [setCartItems, currentUserEmail]);

  useEffect(() => {
    storeCartItems(cartItems);
  }, [cartItems, currentUserEmail]);

  const handleRemoveItem = (itemId) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
    Swal.fire("Success", "Item removed from cart.", "success");
  };

  const handleRemoveAll = () => {
    setCartItems([]);
    Swal.fire("Success", "All items removed from cart.", "success");
  };

  const handleIncreaseQuantity = (itemId) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: item.quantity + 1,
              totalPrice: item.totalPrice + Number(item.pricePerDay),
            }
          : item
      )
    );
  };

  const handleDecreaseQuantity = (itemId) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === itemId && item.quantity > 1
          ? {
              ...item,
              quantity: item.quantity - 1,
              totalPrice: item.totalPrice - Number(item.pricePerDay),
            }
          : item
      )
    );
  };

  const handleViewDetails = (item) => {
    navigate(`/product/${item.id}`, { state: { product: item } });
  };

  const handleSelectItem = (itemId) => {
    setSelectedItemIds((prevSelected) =>
      prevSelected.includes(itemId)
        ? prevSelected.filter((id) => id !== itemId)
        : [...prevSelected, itemId]
    );
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
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate("/user-dashboard")}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-300"
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h2>
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
            {/* Table Layout for Desktop */}
            <div className="hidden md:block">
              <table className="w-full table-auto border-collapse mb-4">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Select</th>
                    <th className="px-4 py-2 text-left">Product</th>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Quantity</th>
                    <th className="px-4 py-2 text-left">Total</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">
                        <input
                          type="checkbox"
                          checked={selectedItemIds.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                        />
                      </td>
                      <td className="px-4 py-2 flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg cursor-pointer"
                          onClick={() => handleViewDetails(item)}
                        />
                        <span className="text-sm font-semibold">{item.name}</span>
                      </td>
                      <td className="px-4 py-2">₹{item.pricePerDay}</td>
                      <td className="px-4 py-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleDecreaseQuantity(item.id)}
                            className="px-2 py-1 bg-gray-200 rounded-lg text-xs"
                          >
                            -
                          </button>
                          <span className="text-sm">{item.quantity}</span>
                          <button
                            onClick={() => handleIncreaseQuantity(item.id)}
                            className="px-2 py-1 bg-gray-200 rounded-lg text-xs"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-2">₹{item.totalPrice.toFixed(2)}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile and Tablet Layout */}
            <div className="md:hidden grid gap-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start border-b pb-4 gap-4"
                >
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedItemIds.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                    />
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg cursor-pointer"
                      onClick={() => handleViewDetails(item)}
                    />
                    <span className="text-sm font-semibold">{item.name}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 w-full">
                    <div className="text-sm text-gray-700 text-center">₹{item.pricePerDay}</div>
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleDecreaseQuantity(item.id)}
                        className="px-2 py-1 bg-gray-200 rounded-lg text-xs"
                      >
                        -
                      </button>
                      <span className="text-sm">{item.quantity}</span>
                      <button
                        onClick={() => handleIncreaseQuantity(item.id)}
                        className="px-2 py-1 bg-gray-200 rounded-lg text-xs"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-sm font-semibold text-center">₹{item.totalPrice.toFixed(2)}</div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Total Price Section */}
        <div className="md:w-1/3 bg-white p-6 rounded-lg shadow-lg mt-6 md:mt-0">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Cart Summary</h3>
          <div className="flex justify-between mb-4">
            <span className="text-sm font-semibold">Total Items:</span>
            <span className="text-sm">{totalItems}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-sm font-semibold">Total Price:</span>
            <span className="text-sm">₹{totalAmount.toFixed(2)}</span>
          </div>
          <button
            onClick={handleProceedToPayment}
            className="bg-green-600 text-white w-full py-2 rounded-lg hover:bg-green-700 transition-colors duration-300"
          >
            Proceed to Payment
          </button>
          <button
            onClick={() => navigate("/user-dashboard")}
            className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 mt-4"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;