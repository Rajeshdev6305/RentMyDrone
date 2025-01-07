import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CartPage = ({ cartItems, setCartItems }) => {
  const navigate = useNavigate();

  const getStoredCartItems = () => {
    const storedItems = localStorage.getItem("cartItems");
    return storedItems ? JSON.parse(storedItems) : [];
  };

  const storeCartItems = (items) => {
    localStorage.setItem("cartItems", JSON.stringify(items));
  };

  useEffect(() => {
    const storedItems = getStoredCartItems();
    if (storedItems.length > 0) {
      setCartItems(storedItems);
    }
  }, [setCartItems]);

  useEffect(() => {
    storeCartItems(cartItems);
  }, [cartItems]);

  const handleRemoveItem = (itemId) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
    alert("Item removed from cart.");
  };

  const handleRemoveAll = () => {
    setCartItems([]);
    alert("All items removed from cart.");
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

  const handleViewDetails = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const totalAmount = cartItems.reduce((total, item) => total + Number(item.totalPrice), 0);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  if (cartItems.length === 0) {
    return <p>Your cart is empty!</p>;
  }

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <div>
          <button onClick={() => navigate(-1)} className="bg-gray-600 text-white px-2 py-1 text-sm rounded mr-2">
            Back
          </button>
          <button onClick={handleRemoveAll} className="bg-red-600 text-white px-2 py-1 text-sm rounded">
            Remove All
          </button>
        </div>
        <h2 className="text-xl font-bold">Total Items: {totalItems}</h2>
        <h2 className="text-xl font-bold">Total Price: ${totalAmount}</h2>
      </div>
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="p-4 border flex justify-between items-center rounded-lg cursor-pointer"
            onClick={() => handleViewDetails(item)}
          >
            <div>
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-sm">Price: ${item.pricePerDay} per day</p>
              <p className="text-sm">Category: {item.category}</p>
              <p className="text-sm">Quantity: {item.quantity}</p>
              <p className="text-sm">Total Price: ${item.totalPrice}</p>
            </div>
            <div className="flex items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDecreaseQuantity(item.id);
                }}
                className="bg-gray-300 text-black px-2 py-1 text-sm rounded-lg mr-2"
              >
                -
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleIncreaseQuantity(item.id);
                }}
                className="bg-gray-300 text-black px-2 py-1 text-sm rounded-lg mr-2"
              >
                +
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveItem(item.id);
                }}
                className="bg-red-500 text-white px-2 py-1 text-sm rounded-lg"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartPage;
