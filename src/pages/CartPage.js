// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Swal from 'sweetalert2'; // Import SweetAlert2
// import { auth } from "../Authentication/firebaseConfig"; // Import auth

// const CartPage = ({ cartItems, setCartItems, currentUserEmail }) => {
//   const [loading, setLoading] = useState(true); // Add loading state
//   const navigate = useNavigate();

//   const getStoredCartItems = () => {
//     const storedItems = localStorage.getItem(`cartItems_${currentUserEmail}`);
//     return storedItems ? JSON.parse(storedItems) : [];
//   };

//   const storeCartItems = (items) => {
//     localStorage.setItem(`cartItems_${currentUserEmail}`, JSON.stringify(items));
//   };

//   useEffect(() => {
//     console.log("auth.currentUser:", auth.currentUser);
//     if (auth.currentUser) {
//       const storedItems = getStoredCartItems();
//       if (storedItems.length > 0) {
//         setCartItems(storedItems);
//       }
//     }
//     setLoading(false); // Set loading to false after cart items are loaded
//   }, [setCartItems, currentUserEmail]);

//   useEffect(() => {
//     storeCartItems(cartItems);
//   }, [cartItems, currentUserEmail]);

//   const handleRemoveItem = (itemId) => {
//     setCartItems(cartItems.filter((item) => item.id !== itemId));
//     Swal.fire('Success', 'Item removed from cart.', 'success');
//   };

//   const handleRemoveAll = () => {
//     setCartItems([]);
//     Swal.fire('Success', 'All items removed from cart.', 'success');
//   };

//   const handleIncreaseQuantity = (itemId) => {
//     setCartItems(
//       cartItems.map((item) =>
//         item.id === itemId
//           ? { ...item, quantity: item.quantity + 1, totalPrice: item.totalPrice + Number(item.pricePerDay) }
//           : item
//       )
//     );
//   };

//   const handleDecreaseQuantity = (itemId) => {
//     setCartItems(
//       cartItems.map((item) =>
//         item.id === itemId && item.quantity > 1
//           ? { ...item, quantity: item.quantity - 1, totalPrice: item.totalPrice - Number(item.pricePerDay) }
//           : item
//       )
//     );
//   };

//   const handleViewDetails = (product) => {
//     navigate(`/product/${product.id}`, { state: { product } });
//   };

//   const totalAmount = cartItems.reduce((total, item) => total + Number(item.totalPrice), 0);
//   const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (cartItems.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-4">
//         <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty!</h2>
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
//         {/* Header Section */}
//         <div className="flex flex-col md:flex-row justify-between items-center mb-8">
//           <div className="flex space-x-2 mb-4 md:mb-0">
//             <button
//               onClick={() => navigate("/user-dashboard")}
//               className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-300"
//             >
//               Back
//             </button>
//             <button
//               onClick={handleRemoveAll}
//               className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300"
//             >
//               Remove All
//             </button>
//           </div>
//           <div className="text-right">
//             <h2 className="text-xl font-bold text-gray-800">Total Items: {totalItems}</h2>
//             <h2 className="text-xl font-bold text-gray-800">Total Price: ₹{totalAmount.toFixed(2)}</h2>
//           </div>
//         </div>

//         {/* Cart Items Section */}
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h2>
//         <div className="space-y-4">
//           {cartItems.map((item) => (
//             <div
//               key={item.id}
//               className="p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4"
//             >
//               <img
//                 src={
//                   item.image.startsWith("data:image")
//                     ? item.image
//                     : `${process.env.PUBLIC_URL}/${item.image}`
//                 }
//                 alt={item.name}
//                 className="w-full md:w-32 h-32 object-cover rounded-lg"
//               />
//               <div className="flex-grow">
//                 <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
//                 <p className="text-sm text-gray-600">Price: ₹{item.pricePerDay} per day</p>
//                 <p className="text-sm text-gray-600">Category: {item.category}</p>
//                 <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
//                 <p className="text-sm text-gray-600">Total Price: ₹{item.totalPrice.toFixed(2)}</p>
//                 <div className="flex items-center space-x-2 mt-2">
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleDecreaseQuantity(item.id);
//                     }}
//                     className="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-300 transition-colors duration-300"
//                   >
//                     -
//                   </button>
//                   <span className="px-3 py-1">{item.quantity}</span>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleIncreaseQuantity(item.id);
//                     }}
//                     className="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-300 transition-colors duration-300"
//                   >
//                     +
//                   </button>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleRemoveItem(item.id);
//                     }}
//                     className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition-colors duration-300"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               </div>
//               <button
//                 onClick={() => handleViewDetails(item)}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
//               >
//                 View Details
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CartPage;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2
import { auth } from "../Authentication/firebaseConfig"; // Import auth

const CartPage = ({ cartItems, setCartItems, currentUserEmail }) => {
  const [loading, setLoading] = useState(true);
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

  const totalAmount = cartItems.reduce(
    (total, item) => total + Number(item.totalPrice),
    0
  );
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
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row">
        {/* Cart Items */}
        <div className="flex-1 mb-8 sm:mb-0 sm:w-2/3">
          <div className="flex justify-between items-center mb-4 sm:mb-8">
            <button
              onClick={() => navigate("/user-dashboard")}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-300"
            >
              Back
            </button>
            <button
              onClick={handleRemoveAll}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300"
            >
              Remove All
            </button>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h2>
          <div className="bg-white p-4 rounded-lg shadow-lg">
            {/* Table Layout for Cart Items (only on larger screens) */}
            <div className="hidden sm:block">
              <table className="w-full table-auto border-collapse mb-4">
                <thead className="bg-gray-100">
                  <tr>
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
                      <td className="px-4 py-2 flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg cursor-pointer"
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

            {/* Mobile Layout for Cart Items */}
            <div className="sm:hidden">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center mb-6 border-b pb-4"
                >
                  <div className="flex items-center space-x-4 sm:w-1/3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg cursor-pointer"
                      onClick={() => handleViewDetails(item)}
                    />
                    <span className="text-sm font-semibold">{item.name}</span>
                  </div>

                  {/* Price, Quantity, Total displayed side by side with even space */}
                  <div className="flex flex-row sm:w-2/3 justify-between mb-2 sm:mb-0 space-x-4">
                    <div className="text-sm text-gray-700 flex-1 text-center">₹{item.pricePerDay}</div>

                    {/* Quantity controls */}
                    <div className="flex items-center space-x-2 flex-1 justify-center">
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

                    <div className="text-sm font-semibold flex-1 text-center">₹{item.totalPrice.toFixed(2)}</div>
                  </div>

                  {/* Remove Button */}
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
        <div className="sm:ml-6 sm:w-1/3 bg-white p-6 rounded-lg shadow-lg">
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
            onClick={() => navigate("/user-dashboard")}
            className="bg-green-600 text-white w-full py-2 rounded-lg hover:bg-green-700 transition-colors duration-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
