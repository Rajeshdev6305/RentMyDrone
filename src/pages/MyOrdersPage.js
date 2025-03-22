import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { auth } from "../Authentication/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  const guestEmail = "guest@guest.com"; // Default email for guest users
  const currentUserEmail = auth.currentUser?.email || guestEmail; // Use logged-in email or guest email

  useEffect(() => {
    const loginState = JSON.parse(localStorage.getItem("loginState"));
    if (!loginState?.isLoggedIn || loginState.userType !== "user") {
      localStorage.setItem("redirectPath", window.location.pathname); // Store current path
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem(`orders_${currentUserEmail}`)) || [];
    const sortedOrders = storedOrders.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    setOrders(sortedOrders);
    setLoading(false);

    const timer = setInterval(() => {
      setOrders((prevOrders) => [...prevOrders]);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentUserEmail]);

  const handleCancelOrder = (orderId) => {
    const updatedOrders = orders.filter((order) => order.id !== orderId);
    setOrders(updatedOrders);
    localStorage.setItem(`orders_${currentUserEmail}`, JSON.stringify(updatedOrders));
    Swal.fire({
      icon: "success",
      title: "Order Cancelled",
      text: "Your order has been cancelled successfully.",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleRemoveOrder = (orderId) => {
    const updatedOrders = orders.filter((order) => order.id !== orderId);
    setOrders(updatedOrders);
    localStorage.setItem(`orders_${currentUserEmail}`, JSON.stringify(updatedOrders));
    Swal.fire({
      icon: "success",
      title: "Order Removed",
      text: "Order has been removed from your history.",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const calculateRemainingCancellationTime = (bookingTime) => {
    if (!bookingTime) return "N/A";

    const bookingDate = new Date(bookingTime);
    const now = new Date();

    // Calculate the cancellation deadline (2 hours from booking time)
    const cancellationDeadline = new Date(bookingDate.getTime() + 2 * 60 * 60 * 1000);

    // Calculate remaining time
    const diff = cancellationDeadline.getTime() - now.getTime();

    if (diff <= 0) return "Time Exceeded";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${days > 0 ? `${days}d ` : ""}${hours > 0 ? `${hours}h ` : ""}${minutes}m ${seconds}s`;
  };

  const calculateReturnTime = (endDate, status) => {
    if (status === "Completed") return "Successfully Returned";
    if (!endDate) return "N/A";

    const end = new Date(endDate);
    const now = new Date();
    const diff = end - now;

    if (diff <= 0) return "Overdue";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    return `${days.toString().padStart(2, "0")}d ${hours.toString().padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m`;
  };

  const getOrderStatus = (startDate, endDate) => {
    if (!startDate || !endDate) return "Pending";
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (now < start) return "Pending";
    if (now >= start && now <= end) return "Processing";
    return "Completed";
  };

  const filteredOrders = filter === "All"
    ? orders
    : orders.filter((order) => getOrderStatus(order.startDate, order.endDate) === filter);

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

  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">No Orders Yet!</h2>
        <p className="text-gray-600 mb-6">Start renting drones to see your orders here.</p>
        <button
          onClick={() => navigate("/user-dashboard")}
          className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-all duration-300 shadow-md"
        >
          Explore Drones
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="sticky top-0 z-10 bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="All">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
          </select>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-300"
          >
            Back
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map(
            (order) =>
              order.product && (
                <div
                  key={order.id}
                  className="bg-white border rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6"
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={order.product.image}
                      alt={order.product.name}
                      className="w-20 h-20 object-cover rounded-md mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {order.product.name}
                      </h3>
                      <span
                        className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                          getOrderStatus(order.startDate, order.endDate) === "Completed"
                            ? "bg-green-100 text-green-800"
                            : getOrderStatus(order.startDate, order.endDate) === "Processing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {getOrderStatus(order.startDate, order.endDate)}
                      </span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 space-y-2">
                    <p>
                      <span className="font-semibold">Order ID:</span> {order.id}
                    </p>
                    <p>
                      <span className="font-semibold">Booking Type:</span> {order.bookingType}
                    </p>
                    <p>
                      <span className="font-semibold">Quantity:</span> {order.quantity}
                    </p>
                    <p>
                      <span className="font-semibold">Total Price:</span> ₹
                      {order.totalPrice.toLocaleString("en-IN")}
                    </p>
                    <p>
                      <span className="font-semibold">Start Date:</span>{" "}
                      {new Date(order.startDate).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-semibold">End Date:</span>{" "}
                      {new Date(order.endDate).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-semibold">Return Time:</span>{" "}
                      <span
                        className={
                          calculateReturnTime(order.endDate, getOrderStatus(order.startDate, order.endDate)) === "Overdue" ? "text-red-600" : ""
                        }
                      >
                        {calculateReturnTime(order.endDate, getOrderStatus(order.startDate, order.endDate))}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold">Payment Status:</span>{" "}
                      {order.paymentStatus || "Pending"}
                    </p>
                    {getOrderStatus(order.startDate, order.endDate) !== "Completed" && (
                      <p>
                        <span className="font-semibold">Cancellation Time Left:</span>{" "}
                        <span
                          className={
                            calculateRemainingCancellationTime(order.startDate) === "Time Exceeded"
                              ? "text-red-600"
                              : "text-green-600"
                          }
                        >
                          {calculateRemainingCancellationTime(order.startDate)}
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex space-x-3">
                    {calculateRemainingCancellationTime(order.startDate) !== "Time Exceeded" && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300"
                      >
                        Cancel Order
                      </button>
                    )}
                    {getOrderStatus(order.startDate, order.endDate) === "Completed" && (
                      <button
                        onClick={() => handleRemoveOrder(order.id)}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-300"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;