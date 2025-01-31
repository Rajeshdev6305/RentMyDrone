import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCartPlus, FaStar } from "react-icons/fa";

const ProductDetailsPage = ({ products = [], setCartItems, cartItems = [] }) => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [bookingType, setBookingType] = useState("day"); // Default to day
  const [bookingDuration, setBookingDuration] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startHour, setStartHour] = useState(""); // New state for start hour
  const [endHour, setEndHour] = useState(""); // New state for end hour
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const prod =
      location.state?.product ||
      products.find((product) => product.id === parseInt(id));
    setProduct(prod);
  }, [id, location.state, products]);

  useEffect(() => {
    if (product) {
      // Calculate total price based on booking type, duration, and quantity
      let price = 0;
      if (bookingType === "day") {
        price = bookingDuration * product.pricePerDay * quantity;
      } else if (bookingType === "month") {
        price = bookingDuration * product.pricePerMonth * quantity;
      } else if (bookingType === "hour") {
        price = bookingDuration * product.pricePerHour * quantity;
      }
      setTotalPrice(price);
    }
  }, [bookingType, bookingDuration, quantity, product]);

  if (!product) {
    return <p>No product details available!</p>;
  }

  const handleBookNow = () => {
    if (
      !deliveryAddress ||
      !startDate ||
      !endDate ||
      (bookingType === "hour" && (!startHour || !endHour))
    ) {
      alert("Please fill in all required details.");
      return;
    }

    if (!product) {
      alert("Product details are not available.");
      return;
    }

    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const isBooked = existingOrders.some((order) => {
      return (
        order.product &&
        order.product.id === product.id &&
        ((new Date(startDate) >= new Date(order.startDate) && new Date(startDate) <= new Date(order.endDate)) ||
          (new Date(endDate) >= new Date(order.startDate) && new Date(endDate) <= new Date(order.endDate)))
      );
    });

    if (isBooked) {
      alert("This product is already booked for the selected dates.");
      return;
    }

    navigate("/payment", {
      state: {
        product,
        totalPrice,
        quantity,
        bookingType,
        bookingDuration,
        deliveryAddress,
        startDate,
        endDate,
        startHour: bookingType === "hour" ? startHour : null,
        endHour: bookingType === "hour" ? endHour : null,
      },
    });
  };

  const getProductDetails = () => {
    switch (product.category) {
      case "Marriage":
        return {
          details: `The ${product.name} is perfect for capturing stunning aerial shots at marriage events. With its advanced camera and stable flight, it ensures you don't miss any special moments.`,
          controlRange: "40 feet",
          speed: "20 mph",
          weight: "500 g",
          cameraQuality: "4K Ultra HD",
          batteryLife: "30 minutes",
          usefulUses:
            "Ideal for wedding photography, videography, and live streaming.",
          additionalSpecs: "GPS, Obstacle Avoidance, 3-Axis Gimbal",
        };
      case "Food Delivery":
        return {
          details: `The ${product.name} is designed for efficient food delivery. It features a secure compartment to keep your food safe and warm during transit.`,
          controlRange: "50 feet",
          speed: "15 mph",
          weight: "600 g",
          payloadCapacity: "2 kg",
          batteryLife: "25 minutes",
          usefulUses:
            "Perfect for delivering food, groceries, and small packages.",
          additionalSpecs: "Temperature Control, GPS Tracking, Auto Return",
        };
      case "Farming":
        return {
          details: `The ${product.name} is ideal for farming applications. It can help with crop monitoring, spraying, and other agricultural tasks, making your farming operations more efficient.`,
          controlRange: "60 feet",
          speed: "10 mph",
          weight: "700 g",
          sprayCapacity: "5 liters",
          batteryLife: "40 minutes",
          usefulUses:
            "Great for crop monitoring, pesticide spraying, and soil analysis.",
          additionalSpecs:
            "Precision Spraying, Real-Time Data, Weather Resistant",
        };
      default:
        return {
          details: `The ${product.name} is a versatile drone suitable for various applications.`,
          controlRange: "30 feet",
          speed: "25 mph",
          weight: "400 g",
          batteryLife: "20 minutes",
          usefulUses:
            "Suitable for general photography, videography, and recreational use.",
          additionalSpecs: "Foldable Design, HD Camera, Long Battery Life",
        };
    }
  };

  const {
    details,
    controlRange,
    speed,
    weight,
    cameraQuality,
    payloadCapacity,
    sprayCapacity,
    batteryLife,
    usefulUses,
    additionalSpecs,
  } = getProductDetails();

  return (
    <div className="max-w-screen-lg mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 text-white px-4 py-2 rounded flex items-center space-x-2"
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <img
            src={
              product.image.startsWith("data:image")
                ? product.image
                : `${process.env.PUBLIC_URL}/${product.image}`
            }
            alt={product.name}
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">{product.name}</h2>

          <div className="flex items-center mb-2">
            {bookingType === "day" && (
              <p className="text-sm text-blue-600 font-bold">
                ${product.pricePerDay} per day
              </p>
            )}
            {bookingType === "month" && (
              <p className="text-sm text-blue-600 font-bold">
                ${product.pricePerMonth} per month
              </p>
            )}
            {bookingType === "hour" && (
              <p className="text-sm text-blue-600 font-bold">
                ${product.pricePerHour} per hour
              </p>
            )}
          </div>

          <p className="text-base mb-2">{product.description}</p>
          <p className="text-sm text-gray-600">Category: {product.category}</p>
          <p className="text-sm text-gray-600">Model: {product.model}</p>
          <p className="text-sm text-gray-600">Control Range: {controlRange}</p>
          <p className="text-sm text-gray-600">Speed: {speed}</p>
          <p className="text-sm text-gray-600">Weight: {weight}</p>
          {cameraQuality && (
            <p className="text-sm text-gray-600">Camera Quality: {cameraQuality}</p>
          )}
          {payloadCapacity && (
            <p className="text-sm text-gray-600">
              Payload Capacity: {payloadCapacity}
            </p>
          )}
          {sprayCapacity && (
            <p className="text-sm text-gray-600">Spray Capacity: {sprayCapacity}</p>
          )}
          <p className="text-sm text-gray-600">Battery Life: {batteryLife}</p>
          <p className="text-base mt-4">{details}</p>
          <p className="text-base mt-4">Useful Uses: {usefulUses}</p>
          <p className="text-base mt-4">Additional Specifications: {additionalSpecs}</p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-bold mb-2">Delivery Address:</label>
        <input
          type="text"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-bold mb-2">Booking Type:</label>
        <select
          value={bookingType}
          onChange={(e) => setBookingType(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="hour">Hour</option>
          <option value="day">Day</option>
          <option value="month">Month</option>
        </select>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-bold mb-2">Booking Duration:</label>
        <input
          type="number"
          value={bookingDuration}
          onChange={(e) => setBookingDuration(e.target.value)}
          className="w-full p-2 border rounded"
          min="1"
        />
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-bold mb-2">Quantity:</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full p-2 border rounded"
          min="1"
        />
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-bold mb-2">Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-bold mb-2">End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {bookingType === "hour" && (
        <>
          <div className="space-y-4">
            <label className="block text-sm font-bold mb-2">Start Hour:</label>
            <input
              type="time"
              value={startHour}
              onChange={(e) => setStartHour(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold mb-2">End Hour:</label>
            <input
              type="time"
              value={endHour}
              onChange={(e) => setEndHour(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </>
      )}

      <div className="mt-4">
        <p className="text-lg font-bold">Total Price: ${totalPrice}</p>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={handleBookNow}
          className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2"
        >
          <FaCartPlus />
          <span>Book Now</span>
        </button>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
