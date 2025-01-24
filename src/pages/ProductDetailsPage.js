import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCartPlus, FaCalendarAlt, FaStar } from "react-icons/fa";

const ProductDetailsPage = ({
  products = [],
  setCartItems,
  cartItems = [],
}) => {
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

  const reviews = {
    Marriage: [
      {
        user: "John Doe",
        rating: 4,
        comment: "Great for wedding photography. Captured amazing shots!",
      },
      {
        user: "Jane Smith",
        rating: 5,
        comment: "Perfect for our wedding event. Highly recommend!",
      },
    ],
    "Food Delivery": [
      {
        user: "Alice Johnson",
        rating: 4,
        comment: "Efficient and reliable for food delivery.",
      },
      {
        user: "Bob Brown",
        rating: 5,
        comment: "Kept the food warm and delivered on time.",
      },
    ],
    Farming: [
      {
        user: "Charlie Davis",
        rating: 4,
        comment: "Great for crop monitoring and spraying.",
      },
      {
        user: "Dana White",
        rating: 5,
        comment: "Made our farming operations more efficient.",
      },
    ],
  };

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
        startHour: bookingType === "hour" ? startHour : null, // Include start hour in the state if booking type is hour
        endHour: bookingType === "hour" ? endHour : null, // Include end hour in the state if booking type is hour
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
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 text-white px-4 py-2 rounded mb-4 flex items-center space-x-2"
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>
      </div>
      <h2 className="text-xl font-bold mb-4">{product.name}</h2>
      <img
        src={
          product.image.startsWith("data:image")
            ? product.image
            : `${process.env.PUBLIC_URL}/${product.image}`
        }
        alt={product.name}
        className="w-80 h-50 object-cover mb-2 rounded"
      />
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

      <p className="text-base">{product.description}</p>
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
      <p className="text-base mt-4">
        Additional Specifications: {additionalSpecs}
      </p>

      <div className="mt-4">
        <label className="block text-sm font-bold mb-2">
          Delivery Address:
        </label>
        <input
          type="text"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-bold mb-2">Booking Type:</label>
        <select
          value={bookingType}
          onChange={(e) => setBookingType(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="day">Day</option>
          <option value="month">Month</option>
          <option value="hour">Hour</option>
        </select>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-bold mb-2">
          Booking Duration:
        </label>
        <input
          type="number"
          value={bookingDuration}
          onChange={(e) => setBookingDuration(e.target.value)}
          className="w-full p-2 border rounded"
          min="1"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-bold mb-2">Quantity:</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full p-2 border rounded"
          min="1"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-bold mb-2">Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mt-4">
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
          <div className="mt-4">
            <label className="block text-sm font-bold mb-2">Start Hour:</label>
            <input
              type="time"
              value={startHour}
              onChange={(e) => setStartHour(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mt-4">
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

      <div className="flex justify-between mt-4">
        <button
          onClick={handleBookNow}
          className="bg-green-600 text-white px-2 py-1 text-sm rounded hover:bg-green-700 transition flex items-center space-x-2"
        >
          <FaCartPlus />
          <span>Book Now</span>
        </button>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-bold mb-4">Ratings & Reviews</h3>
        {product.reviews && product.reviews.length > 0
          ? product.reviews.map((review, index) => (
              <div key={index} className="border p-4 rounded-lg mb-4">
                <p className="text-sm font-bold">{review.user}</p>
                <p className="flex items-center">
                  {[...Array(review.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-500" />
                  ))}
                  {[...Array(5 - review.rating)].map((_, i) => (
                    <FaStar key={i} className="text-gray-400" />
                  ))}
                </p>
                <p className="text-sm">{review.comment}</p>
              </div>
            ))
          : reviews[product.category]?.map((review, index) => (
              <div key={index} className="border p-4 rounded-lg mb-4">
                <p className="text-sm font-bold">{review.user}</p>
                <p className="flex items-center">
                  {[...Array(review.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-500" />
                  ))}
                  {[...Array(5 - review.rating)].map((_, i) => (
                    <FaStar key={i} className="text-gray-400" />
                  ))}
                </p>
                <p className="text-sm">{review.comment}</p>
              </div>
            ))}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
