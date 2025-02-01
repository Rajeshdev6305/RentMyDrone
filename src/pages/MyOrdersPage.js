import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'; // Import SweetAlert2
import { auth } from "../Authentication/firebaseConfig"; // Import auth

const MyOrdersPage = ({ currentUserEmail }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    console.log("auth.currentUser:", auth.currentUser);
    console.log("currentUserEmail:", currentUserEmail);
    if (auth.currentUser) {
      const storedOrders = JSON.parse(localStorage.getItem(`orders_${currentUserEmail}`)) || [];
      console.log("Retrieved orders for user:", storedOrders);
      setOrders(storedOrders);
    }
    setLoading(false); // Set loading to false after orders are loaded
  }, [currentUserEmail]);

  const handleCancelOrder = (orderId) => {
    const updatedOrders = orders.filter((order) => order.id !== orderId);
    setOrders(updatedOrders);
    localStorage.setItem(`orders_${currentUserEmail}`, JSON.stringify(updatedOrders));
    Swal.fire('Success', 'Order cancelled successfully.', 'success');
  };

  const calculateRemainingTime = (orderTime) => {
    const orderDate = new Date(orderTime);
    const now = new Date();
    const diff = orderDate.getTime() + 60 * 60 * 1000 - now.getTime(); // 1 hour in milliseconds
    if (diff <= 0) {
      return "Time exceeded";
    }
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const calculateReturnTime = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end - now;
    if (diff <= 0) {
      return "Return time exceeded";
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">There are no orders!</h2>
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>
        <div className="space-y-4">
          {orders.map((order) => (
            order.product && (
              <div key={order.id} className="p-6 bg-white border border-gray-200 rounded-lg shadow-md flex">
                <img
                  src={
                    order.product.image.startsWith("data:image")
                      ? order.product.image
                      : `${process.env.PUBLIC_URL}/${order.product.image}`
                  }
                  alt={order.product.name}
                  className="w-32 h-32 object-cover rounded-lg mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{order.product.name}</h3>
                  <p className="text-sm text-gray-600">Booking Type: {order.bookingType}</p>
                  <p className="text-sm text-gray-600">Booking Duration: {order.bookingDuration}</p>
                  <p className="text-sm text-gray-600">Quantity: {order.quantity}</p>
                  <p className="text-sm text-gray-600">Total Price: ${order.totalPrice}</p>
                  <p className="text-sm text-gray-600">Start Date: {order.startDate}</p>
                  <p className="text-sm text-gray-600">End Date: {order.endDate}</p>
                  <p className="text-sm text-gray-600">Remaining Return Time: {calculateReturnTime(order.endDate)}</p>
                  <p className="text-sm text-gray-600">Payment Status: {order.paymentStatus}</p>
                  <div className="mt-4">
                    <h4 className="text-sm font-bold text-gray-800">Cancellation Time:</h4>
                    <p className="text-sm text-gray-600">{calculateRemainingTime(order.id)}</p>
                    {calculateRemainingTime(order.id) !== "Time exceeded" ? (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300 mt-2"
                      >
                        Cancel Order
                      </button>
                    ) : (
                      <p className="text-sm text-red-600 mt-2">Cancellation time exceeded</p>
                    )}
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;
