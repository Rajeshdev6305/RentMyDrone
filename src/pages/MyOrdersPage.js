import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(storedOrders);
  }, []);

  const handleCancelOrder = (orderId) => {
    const updatedOrders = orders.filter((order) => order.id !== orderId);
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    alert("Order cancelled successfully.");
  };

  const calculateRemainingTime = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">There are no orders!</h2>
        <button
          onClick={() => navigate("/")}
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
                  <p className="text-sm text-gray-600">Remaining Time: {calculateRemainingTime(order.endDate)}</p>
                  <p className="text-sm text-gray-600">Payment Status: {order.paymentStatus}</p>
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300 mt-4"
                  >
                    Cancel Order
                  </button>
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
