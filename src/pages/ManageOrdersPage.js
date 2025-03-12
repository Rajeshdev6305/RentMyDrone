// import React, { useEffect, useState } from "react";
// import Swal from "sweetalert2";

// const ManageOrdersPage = () => {
//   const [orders, setOrders] = useState([]);

//   const fetchOrders = () => {
//     const allOrders = JSON.parse(localStorage.getItem("orders")) || {};
//     const ordersArray = Object.keys(allOrders).flatMap((email) =>
//       allOrders[email].map((order) => ({ ...order, userEmail: email }))
//     );
//     setOrders(ordersArray);
//   };

//   useEffect(() => {
//     fetchOrders();
//     window.addEventListener("storage", fetchOrders);

//     return () => {
//       window.removeEventListener("storage", fetchOrders);
//     };
//   }, []);

//   const handleDeleteOrder = (index) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "This action cannot be undone!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         const updatedOrders = [...orders];
//         const [deletedOrder] = updatedOrders.splice(index, 1);
//         const existingOrders = JSON.parse(localStorage.getItem("orders")) || {};
//         const userOrders = existingOrders[deletedOrder.userEmail] || [];
//         const updatedUserOrders = userOrders.filter((order) => order.id !== deletedOrder.id);
//         existingOrders[deletedOrder.userEmail] = updatedUserOrders;
//         localStorage.setItem("orders", JSON.stringify(existingOrders));
//         setOrders(updatedOrders);
//         Swal.fire("Deleted!", "The order has been removed.", "success");
//       }
//     });
//   };

//   const getOrderStatus = (startDate, endDate) => {
//     const now = new Date();
//     const start = new Date(startDate);
//     const end = new Date(endDate);

//     if (now < start) return "Pending";
//     else if (now >= start && now <= end) return "Processing";
//     else return "Completed";
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Pending":
//         return "bg-yellow-100 text-yellow-800";
//       case "Processing":
//         return "bg-blue-100 text-blue-800";
//       case "Completed":
//         return "bg-green-100 text-green-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-extrabold text-gray-900">Manage Orders</h1>
//           <div className="flex items-center space-x-4">
//             <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
//               Total Orders: {orders.length}
//             </span>
//             <button
//               onClick={fetchOrders}
//               className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200"
//             >
//               Refresh
//             </button>
//           </div>
//         </div>

//         {orders.length === 0 ? (
//           <div className="text-center py-12">
//             <p className="text-lg text-gray-500">No orders available yet!</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {orders.map((order, index) => (
//               <div
//                 key={index}
//                 className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
//               >
//                 <div className="flex flex-col md:flex-row">
//                   {/* Image Section - Increased Size */}
//                   <div className="w-full md:w-2/5 h-64 bg-gray-200">
//                     <img
//                       src={
//                         order.product.image.startsWith("data:image")
//                           ? order.product.image
//                           : `${process.env.PUBLIC_URL}/${order.product.image}`
//                       }
//                       alt={order.product.name}
//                       className="w-full h-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-t-none"
//                       onError={(e) => (e.target.src = "https://via.placeholder.com/300")}
//                     />
//                   </div>
//                   {/* Details Section */}
//                   <div className="w-full md:w-3/5 p-6 space-y-3">
//                     <h2 className="text-xl font-semibold text-gray-900 truncate">
//                       {order.product.name}
//                     </h2>
//                     <p className="text-sm text-gray-600">
//                       <span className="font-medium">User:</span> {order.userEmail}
//                     </p>
//                     {order.product.models && (
//                       <p className="text-sm text-gray-600">
//                         <span className="font-medium">Models:</span>{" "}
//                         {order.product.models.join(", ")}
//                       </p>
//                     )}
//                     <p className="text-sm text-gray-600">
//                       <span className="font-medium">Type:</span> {order.bookingType}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       <span className="font-medium">Duration:</span> {order.bookingDuration}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       <span className="font-medium">Quantity:</span> {order.quantity}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       <span className="font-medium">Total:</span> ₹{order.totalPrice}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       <span className="font-medium">Address:</span> {order.deliveryAddress}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       <span className="font-medium">Start:</span> {order.startDate}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       <span className="font-medium">End:</span> {order.endDate}
//                     </p>
//                     {order.bookingType === "hour" && (
//                       <>
//                         <p className="text-sm text-gray-600">
//                           <span className="font-medium">Start Hour:</span> {order.startHour}
//                         </p>
//                         <p className="text-sm text-gray-600">
//                           <span className="font-medium">End Hour:</span> {order.endHour}
//                         </p>
//                       </>
//                     )}
//                     <div className="flex items-center justify-between mt-4">
//                       <span
//                         className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
//                           getOrderStatus(order.startDate, order.endDate)
//                         )}`}
//                       >
//                         {getOrderStatus(order.startDate, order.endDate)}
//                       </span>
//                       <button
//                         onClick={() => handleDeleteOrder(index)}
//                         className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ManageOrdersPage;

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const ManageOrdersPage = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    const allOrders = JSON.parse(localStorage.getItem("orders")) || {};
    const ordersArray = Object.keys(allOrders).flatMap((email) =>
      allOrders[email].map((order) => ({ ...order, userEmail: email }))
    );
    setOrders(ordersArray);
  };

  useEffect(() => {
    fetchOrders();
    window.addEventListener("storage", fetchOrders);

    return () => {
      window.removeEventListener("storage", fetchOrders);
    };
  }, []);

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
        existingOrders[deletedOrder.userEmail] = updatedUserOrders;
        localStorage.setItem("orders", JSON.stringify(existingOrders));
        setOrders(updatedOrders);
        Swal.fire("Deleted!", "The order has been removed.", "success");
      }
    });
  };

  const getOrderStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

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
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
              >
                {/* Details Section - Full Width */}
                <div className="p-6 space-y-3">
                  <h2 className="text-xl font-semibold text-gray-900 truncate">
                    {order.product.name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">User:</span> {order.userEmail}
                  </p>
                  {order.product.models && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Models:</span>{" "}
                      {order.product.models.join(", ")}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Type:</span> {order.bookingType}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Duration:</span> {order.bookingDuration}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Quantity:</span> {order.quantity}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Total:</span> ₹{order.totalPrice}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Address:</span> {order.deliveryAddress}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Start:</span> {order.startDate}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">End:</span> {order.endDate}
                  </p>
                  {order.bookingType === "hour" && (
                    <>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Start Hour:</span> {order.startHour}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">End Hour:</span> {order.endHour}
                      </p>
                    </>
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