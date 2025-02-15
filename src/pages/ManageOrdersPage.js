import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const ManageOrdersPage = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    const allOrders = JSON.parse(localStorage.getItem("orders")) || {};
    const ordersArray = Object.keys(allOrders).flatMap(email =>
      allOrders[email].map(order => ({ ...order, userEmail: email }))
    );
    setOrders(ordersArray);
  };

  useEffect(() => {
    fetchOrders();
    window.addEventListener('storage', fetchOrders);

    return () => {
      window.removeEventListener('storage', fetchOrders);
    };
  }, []);

  const handleDeleteOrder = (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedOrders = [...orders];
        const [deletedOrder] = updatedOrders.splice(index, 1);
        const existingOrders = JSON.parse(localStorage.getItem("orders")) || {};
        const userOrders = existingOrders[deletedOrder.userEmail] || [];
        const updatedUserOrders = userOrders.filter(order => order.id !== deletedOrder.id);
        existingOrders[deletedOrder.userEmail] = updatedUserOrders;
        localStorage.setItem("orders", JSON.stringify(existingOrders));
        setOrders(updatedOrders);
        Swal.fire("Deleted!", "The order has been deleted.", "success");
      }
    });
  };

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

  return (
    <div className="max-w-screen-lg mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Orders</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Orders ({orders.length})
        </button>
      </div>
      {orders.length === 0 ? (
        <p className="text-center">No orders available!</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order, index) => (
            <div key={index} className="border p-4 rounded-lg shadow-lg flex flex-col md:flex-row items-center md:items-start">
              <div className="w-full md:w-1/4 mb-4 md:mb-0">
                <img
                  src={
                    order.product.image.startsWith("http")
                      ? order.product.image
                      : `${process.env.PUBLIC_URL}/${order.product.image}`
                  }
                  alt={order.product.name}
                  className="w-full h-auto object-cover rounded-lg shadow-lg"
                />
              </div>
              <div className="w-full md:w-3/4 md:pl-6">
                <h2 className="text-xl font-bold mb-2">{order.product.name}</h2>
                <p className="text-sm text-gray-600"><span className="text-black">User Email:</span> {order.userEmail}</p>
                <p className="text-sm text-gray-600"><span className="text-black">Booking Type:</span> {order.bookingType}</p>
                <p className="text-sm text-gray-600"><span className="text-black">Booking Duration:</span> {order.bookingDuration}</p>
                <p className="text-sm text-gray-600"><span className="text-black">Quantity:</span> {order.quantity}</p>
                <p className="text-sm text-gray-600"><span className="text-black">Total Price:</span> ₹{order.totalPrice}</p>
                <p className="text-sm text-gray-600"><span className="text-black">Delivery Address:</span> {order.deliveryAddress}</p>
                <p className="text-sm text-gray-600"><span className="text-black">Start Date:</span> {order.startDate}</p>
                <p className="text-sm text-gray-600"><span className="text-black">End Date:</span> {order.endDate}</p>
                {order.bookingType === "hour" && (
                  <>
                    <p className="text-sm text-gray-600"><span className="text-black">Start Hour:</span> {order.startHour}</p>
                    <p className="text-sm text-gray-600"><span className="text-black">End Hour:</span> {order.endHour}</p>
                  </>
                )}
                <p className="text-sm text-gray-600"><span className="text-black">Status:</span> {getOrderStatus(order.startDate, order.endDate)}</p>
                <button
                  onClick={() => handleDeleteOrder(index)}
                  className="bg-red-600 text-white px-4 py-2 rounded mt-4"
                >
                  Delete Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageOrdersPage;
