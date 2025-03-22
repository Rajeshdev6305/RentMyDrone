import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ManageOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = () => {
    try {
      const allOrders = JSON.parse(localStorage.getItem("orders")) || {};
      const ordersArray = Object.keys(allOrders).flatMap((email) =>
        allOrders[email].map((order) => ({ ...order, userEmail: email }))
      );

      const guestOrders = JSON.parse(localStorage.getItem("orders_guest@guest.com")) || [];
      const combinedOrders = [...ordersArray, ...guestOrders.map((order) => ({ ...order, userEmail: "guest@guest.com" }))];

      setOrders(combinedOrders);
    } catch (error) {
      console.error("Error fetching orders from localStorage:", error);
      setOrders([]); // Fallback to empty array if parsing fails
      Swal.fire("Error", "Failed to load orders!", "error");
    } finally {
      setLoading(false); // Ensure loading is set to false regardless of success or failure
    }
  };

  useEffect(() => {
    const loginState = JSON.parse(localStorage.getItem("loginState"));
    if (!loginState?.isLoggedIn || loginState.userType !== "admin") {
      localStorage.setItem("redirectPath", window.location.pathname); // Store current path
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    fetchOrders(); // Fetch orders on mount

    // Listen for storage changes from other tabs
    const handleStorageChange = (e) => {
      if (e.key === "orders") {
        fetchOrders(); // Re-fetch orders when storage changes
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []); // Empty dependency array ensures this runs only on mount

  const handleDeleteOrder = (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedOrders = [...orders];
        const [deletedOrder] = updatedOrders.splice(index, 1);
        const existingOrders = JSON.parse(localStorage.getItem("orders")) || {};
        const userOrders = existingOrders[deletedOrder.userEmail] || [];
        const updatedUserOrders = userOrders.filter((order) => order.id !== deletedOrder.id);

        // Update localStorage
        try {
          if (updatedUserOrders.length > 0) {
            existingOrders[deletedOrder.userEmail] = updatedUserOrders;
          } else {
            delete existingOrders[deletedOrder.userEmail]; // Remove user key if no orders remain
          }
          localStorage.setItem("orders", JSON.stringify(existingOrders));
          setOrders(updatedOrders);
          Swal.fire("Deleted!", "The order has been removed.", "success");
        } catch (error) {
          console.error("Error updating localStorage:", error);
          Swal.fire("Error", "Failed to delete order!", "error");
        }
      }
    });
  };

  const getOrderStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (!startDate || !endDate) return "Unknown"; // Handle missing dates
    if (now < start) return "Pending";
    else if (now >= start && now <= end) return "Processing";
    else return "Completed";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Unknown":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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

    return `${days > 0 ? `${days}d ` : ""}${hours > 0 ? `${hours}h ` : ""}${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Manage Orders</h1>
          <div className="flex items-center space-x-4">
            <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
              Total Orders: {orders.length}
            </span>
            <button
              onClick={fetchOrders}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200"
            >
              Refresh
            </button>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">No orders available yet!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {orders.map((order, index) => (
              <div
                key={order.id || index} // Use order.id if available, fallback to index
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
              >
                <div className="p-6 space-y-3">
                  <h2 className="text-xl font-semibold text-gray-900 truncate">
                    {order.product?.name || "Unnamed Product"}
                  </h2>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">User:</span> {order.userEmail || "N/A"}
                  </p>
                  {order.product?.models && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Models:</span>{" "}
                      {order.product.models.join(", ") || "N/A"}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Type:</span> {order.bookingType || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Duration:</span> {order.bookingDuration || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Quantity:</span> {order.quantity || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Total:</span> ₹{order.totalPrice || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Address:</span> {order.deliveryAddress || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Start:</span> {order.startDate || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">End:</span> {order.endDate || "N/A"}
                  </p>
                  {order.bookingType === "hour" && (
                    <>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Start Hour:</span> {order.startHour || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">End Hour:</span> {order.endHour || "N/A"}
                      </p>
                    </>
                  )}
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Return Time:</span>{" "}
                    <span
                      className={
                        calculateReturnTime(order.endDate, getOrderStatus(order.startDate, order.endDate)) === "Overdue"
                          ? "text-red-600"
                          : ""
                      }
                    >
                      {calculateReturnTime(order.endDate, getOrderStatus(order.startDate, order.endDate))}
                    </span>
                  </p>
                  {getOrderStatus(order.startDate, order.endDate) !== "Completed" && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Cancellation Time Left:</span>{" "}
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
                  <div className="flex items-center justify-between mt-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        getOrderStatus(order.startDate, order.endDate)
                      )}`}
                    >
                      {getOrderStatus(order.startDate, order.endDate)}
                    </span>
                    <button
                      onClick={() => handleDeleteOrder(index)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrdersPage;