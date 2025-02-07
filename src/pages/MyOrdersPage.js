// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2"; // Import SweetAlert2
// import { auth } from "../Authentication/firebaseConfig"; // Import auth

// const MyOrdersPage = ({ currentUserEmail }) => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true); // Add loading state
//   const navigate = useNavigate();

//   useEffect(() => {
//     console.log("auth.currentUser:", auth.currentUser);
//     console.log("currentUserEmail:", currentUserEmail);
//     if (auth.currentUser) {
//       const storedOrders =
//         JSON.parse(localStorage.getItem(`orders_${currentUserEmail}`)) || [];
//       console.log("Retrieved orders for user:", storedOrders);
//       setOrders(storedOrders);
//     }
//     setLoading(false); // Set loading to false after orders are loaded
//   }, [currentUserEmail]);

//   const handleCancelOrder = (orderId) => {
//     const updatedOrders = orders.filter((order) => order.id !== orderId);
//     setOrders(updatedOrders);
//     localStorage.setItem(
//       `orders_${currentUserEmail}`,
//       JSON.stringify(updatedOrders)
//     );
//     Swal.fire("Success", "Order cancelled successfully.", "success");
//   };

//   const calculateRemainingTime = (orderTime) => {
//     const orderDate = new Date(orderTime);
//     const now = new Date();
//     const diff = orderDate.getTime() + 60 * 60 * 1000 - now.getTime(); // 1 hour in milliseconds
//     if (diff <= 0) {
//       return "Time exceeded";
//     }
//     const minutes = Math.floor(diff / (1000 * 60));
//     const seconds = Math.floor((diff % (1000 * 60)) / 1000);
//     return `${minutes}m ${seconds}s`;
//   };

//   const calculateReturnTime = (endDate) => {
//     const end = new Date(endDate);
//     const now = new Date();
//     const diff = end - now;
//     if (diff <= 0) {
//       return "Return time exceeded";
//     }
//     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//     const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
//     const minutes = Math.floor((diff / (1000 * 60)) % 60);
//     return `${days}d ${hours}h ${minutes}m`;
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (orders.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-4">
//         <h2 className="text-2xl font-bold text-gray-800 mb-4">
//           There are no orders!
//         </h2>
//         <button
//           onClick={() => navigate("/user-dashboard")}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
//         >
//           Continue Shopping
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-6">
//       <div className="max-w-4xl mx-auto">
//         <div className="flex justify-between items-center mb-6">
//           <button
//             onClick={() => navigate(-1)}
//             className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-300"
//           >
//             Back
//           </button>
//           <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
//         </div>
//         <div className="space-y-4">
//           {orders.map(
//             (order) =>
//               order.product && (
//                 <div
//                   key={order.id}
//                   className="p-6 bg-white border border-gray-200 rounded-lg shadow-md flex"
//                 >
//                   <img
//                     src={
//                       order.product.image.startsWith("data:image")
//                         ? order.product.image
//                         : `${process.env.PUBLIC_URL}/${order.product.image}`
//                     }
//                     alt={order.product.name}
//                     className="w-32 h-32 object-cover rounded-lg mr-4"
//                   />
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-800">
//                       {order.product.name}
//                     </h3>
//                     <p className="text-sm text-gray-600">
//                       Booking Type: {order.bookingType}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       Booking Duration: {order.bookingDuration}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       Quantity: {order.quantity}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       Total Price: ₹{order.totalPrice}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       Start Date: {order.startDate}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       End Date: {order.endDate}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       Remaining Return Time:{" "}
//                       {calculateReturnTime(order.endDate)}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       Payment Status: {order.paymentStatus}
//                     </p>
//                     <div className="mt-4">
//                       <h4 className="text-sm font-bold text-gray-800">
//                         Cancellation Time:
//                       </h4>
//                       <p className="text-sm text-gray-600">
//                         {calculateRemainingTime(order.id)}
//                       </p>
//                       {calculateRemainingTime(order.id) !== "Time exceeded" ? (
//                         <button
//                           onClick={() => handleCancelOrder(order.id)}
//                           className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300 mt-2"
//                         >
//                           Cancel Order
//                         </button>
//                       ) : (
//                         <p className="text-sm text-red-600 mt-2">
//                           Cancellation time exceeded
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyOrdersPage;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2
import { auth } from "../Authentication/firebaseConfig"; // Import auth

const MyOrdersPage = ({ currentUserEmail }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.currentUser) {
      const storedOrders =
        JSON.parse(localStorage.getItem(`orders_${currentUserEmail}`)) || [];

      // Sort orders by startDate in descending order (newest first)
      const sortedOrders = storedOrders.sort((a, b) => {
        const dateA = new Date(a.startDate); // Convert to Date object
        const dateB = new Date(b.startDate); // Convert to Date object
        return dateB - dateA; // Sort descending
      });

      setOrders(sortedOrders);
    }
    setLoading(false); // Set loading to false after orders are loaded
  }, [currentUserEmail]);

  const handleCancelOrder = (orderId) => {
    // Remove the order and update the state
    const updatedOrders = orders.filter((order) => order.id !== orderId);
    setOrders(updatedOrders); // Update state immediately
    localStorage.setItem(
      `orders_${currentUserEmail}`,
      JSON.stringify(updatedOrders)
    );
    Swal.fire("Success", "Order cancelled successfully.", "success");
  };

  const handleRemoveOrder = (orderId) => {
    // Remove the order and update the state
    const updatedOrders = orders.filter((order) => order.id !== orderId);
    setOrders(updatedOrders); // Update state immediately
    localStorage.setItem(
      `orders_${currentUserEmail}`,
      JSON.stringify(updatedOrders)
    );
    Swal.fire("Success", "Order removed successfully.", "success");
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

  // Determine order status based on dates
  const getOrderStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return "Pending"; // Order is pending before the start date
    } else if (now >= start && now <= end) {
      return "Processing"; // Order is processing during the booking window
    } else {
      return "Completed"; // Order is completed after the end date
    }
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
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          There are no orders!
        </h2>
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
      <div className="max-w-7xl mx-auto"> {/* Increased container width */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-300"
          >
            Back
          </button>
          <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {orders.map(
            (order) =>
              order.product && (
                <div
                  key={order.id}
                  className="p-6 bg-white border border-gray-200 rounded-lg shadow-md flex flex-col sm:flex-row"
                >
                  {/* Product Image Column */}
                  <div className="sm:w-1/3 mb-4 sm:mb-0">
                    <img
                      src={order.product.image}
                      alt={order.product.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  {/* Order Details Column */}
                  <div className="sm:w-2/3 pl-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {order.product.name}
                    </h3>
                    <div className="text-sm text-gray-600 mt-2">
                      <div className="grid grid-cols-2 gap-2">
                        <p className="font-semibold">Booking Type:</p>
                        <p>{order.bookingType}</p>

                        <p className="font-semibold">Booking Duration:</p>
                        <p>{order.bookingDuration}</p>

                        <p className="font-semibold">Quantity:</p>
                        <p>{order.quantity}</p>

                        <p className="font-semibold">Total Price:</p>
                        <p>₹{order.totalPrice}</p>

                        <p className="font-semibold">Start Date:</p>
                        <p>{order.startDate}</p>

                        <p className="font-semibold">End Date:</p>
                        <p>{order.endDate}</p>

                        <p className="font-semibold">Remaining Return Time:</p>
                        <p>{calculateReturnTime(order.endDate)}</p>

                        <p className="font-semibold">Payment Status:</p>
                        <p>{order.paymentStatus}</p>

                        <p className="font-semibold">Status:</p>
                        <p
                          className={`${
                            getOrderStatus(order.startDate, order.endDate) === "Completed"
                              ? "bg-green-600 text-white"
                              : getOrderStatus(order.startDate, order.endDate) === "Processing"
                              ? "bg-blue-600 text-white"
                              : "bg-yellow-600 text-black"
                          } px-4 py-2 rounded-full w-max`}
                        >
                          {getOrderStatus(order.startDate, order.endDate)}
                        </p>

                        {getOrderStatus(order.startDate, order.endDate) !== "Completed" && (
                          <>
                            <p className="font-semibold">Cancellation Time:</p>
                            <p>{calculateRemainingTime(order.id)}</p>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mt-4">
                      {getOrderStatus(order.startDate, order.endDate) !== "Completed" ? (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300 mt-2"
                        >
                          Cancel Order
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRemoveOrder(order.id)}
                          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-300 mt-2"
                        >
                          Remove Order
                        </button>
                      )}
                    </div>
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
