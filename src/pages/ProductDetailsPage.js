import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCartPlus, FaStar } from "react-icons/fa";
import Swal from "sweetalert2";

const ProductDetailsPage = ({ setCartItems, cartItems = [] }) => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [bookingType, setBookingType] = useState("day");
  const [bookingDuration, setBookingDuration] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startHour, setStartHour] = useState("");
  const [endHour, setEndHour] = useState("");
  const [product, setProduct] = useState(null);
  const currentUserEmail = location.state?.currentUserEmail;

  // Fetch product details from an API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const prodFromState = location.state?.product;
        if (prodFromState) {
          setProduct(prodFromState);
          setLoading(false);
          return;
        }
        const response = await fetch(`https://your-api-endpoint.com/products/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const productData = await response.json();
        setProduct(productData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        Swal.fire("Error", "Unable to fetch product details.", "error");
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id, location.state]);

  // Calculate total price based on booking type, duration, and quantity
  useEffect(() => {
    if (product) {
      let price = 0;
      const safeQuantity = Math.max(0, parseInt(quantity) || 0);
      const safeDuration = Math.max(0, parseInt(bookingDuration) || 0);

      if (bookingType === "day") {
        price = safeDuration * product.pricePerDay * safeQuantity;
      } else if (bookingType === "month") {
        price = safeDuration * product.pricePerMonth * safeQuantity;
      } else if (bookingType === "hour") {
        price = safeDuration * product.pricePerHour * safeQuantity;
      }
      setTotalPrice(isNaN(price) ? 0 : price);
    }
  }, [bookingType, bookingDuration, quantity, product]);

  // Calculate actual duration between start and end dates
  const calculateActualDuration = () => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (bookingType === "day") {
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert ms to days
      return diffDays > 0 ? diffDays : 0;
    } else if (bookingType === "month") {
      const diffYears = end.getFullYear() - start.getFullYear();
      const diffMonths = diffYears * 12 + (end.getMonth() - start.getMonth());
      return diffMonths > 0 ? diffMonths : 0;
    } else if (bookingType === "hour") {
      if (!startHour || !endHour) return 0;
      const startTime = new Date(`${startDate}T${startHour}:00`);
      const endTime = new Date(`${endDate}T${endHour}:00`);
      const diffTime = endTime - startTime;
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60)); // Convert ms to hours
      return diffHours > 0 ? diffHours : 0;
    }
    return 0;
  };

  // Handle booking submission with duration validation
  const handleBookNow = () => {
    if (!deliveryAddress || !startDate || !endDate || (bookingType === "hour" && (!startHour || !endHour))) {
      Swal.fire("Error", "Please fill in all required fields.", "error");
      return;
    }

    const actualDuration = calculateActualDuration();
    const safeDuration = Math.max(0, parseInt(bookingDuration) || 0);

    if (safeDuration !== actualDuration) {
      Swal.fire(
        "Error",
        `The selected duration (${safeDuration} ${bookingType}(s)) does not match the date range (${actualDuration} ${bookingType}(s)). Please adjust the duration or dates.`,
        "error"
      );
      return;
    }

    const email = currentUserEmail || "guest";
    const existingOrders = JSON.parse(localStorage.getItem("orders")) || {};
    const userOrders = existingOrders[email] || [];

    const isBooked = userOrders.some((order) => {
      return (
        order.product &&
        order.product.id === product.id &&
        ((new Date(startDate) >= new Date(order.startDate) &&
          new Date(startDate) <= new Date(order.endDate)) ||
          (new Date(endDate) >= new Date(order.startDate) &&
            new Date(endDate) <= new Date(order.endDate)))
      );
    });

    if (isBooked) {
      Swal.fire("Error", "This product is already booked for the selected dates.", "error");
      return;
    }

    const newOrder = {
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
      currentUserEmail: email,
      userDetails: { name: "User Name", phone: "User Phone" },
    };

    userOrders.push(newOrder);
    existingOrders[email] = userOrders;
    localStorage.setItem("orders", JSON.stringify(existingOrders));
    navigate("/payment", { state: newOrder });
  };

  // Get product details based on category
  const getProductDetails = () => {
    if (!product) return {};

    switch (product.category) {
      case "Marriage":
        return {
          details: `The ${product.name} is perfect for capturing stunning aerial shots at marriage events.`,
          controlRange: "40 feet",
          speed: "20 mph",
          weight: "500 g",
          cameraQuality: "4K Ultra HD",
          batteryLife: "30 minutes",
          usefulUses: "Ideal for wedding photography, videography, and live streaming.",
          additionalSpecs: "GPS, Obstacle Avoidance, 3-Axis Gimbal",
        };
      case "Food Delivery":
        return {
          details: `The ${product.name} is designed for efficient food delivery.`,
          controlRange: "50 feet",
          speed: "15 mph",
          weight: "600 g",
          payloadCapacity: "2 kg",
          batteryLife: "25 minutes",
          usefulUses: "Perfect for delivering food, groceries, and small packages.",
          additionalSpecs: "Temperature Control, GPS Tracking, Auto Return",
        };
      case "Farming":
        return {
          details: `The ${product.name} is ideal for farming applications.`,
          controlRange: "60 feet",
          speed: "10 mph",
          weight: "700 g",
          sprayCapacity: "5 liters",
          batteryLife: "40 minutes",
          usefulUses: "Great for crop monitoring, pesticide spraying, and soil analysis.",
          additionalSpecs: "Precision Spraying, Real-Time Data, Weather Resistant",
        };
      default:
        return {
          details: `The ${product.name} is a versatile drone suitable for various applications.`,
          controlRange: "30 feet",
          speed: "25 mph",
          weight: "400 g",
          batteryLife: "20 minutes",
          usefulUses: "Suitable for general photography, videography, and recreational use.",
          additionalSpecs: "Foldable Design, HD Camera, Long Battery Life",
        };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl text-gray-600">No product details available!</p>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Products
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
            <div className="flex items-center mb-4">
              <FaStar className="text-yellow-400 mr-1" />
              <span className="text-gray-600">4.8 (120 reviews)</span>
            </div>
            <p className="text-gray-600 mb-4">{details}</p>
            <div className="mb-6">
              {bookingType === "day" && (
                <p className="text-2xl font-bold text-blue-600">₹{product.pricePerDay} / day</p>
              )}
              {bookingType === "month" && (
                <p className="text-2xl font-bold text-blue-600">₹{product.pricePerMonth} / month</p>
              )}
              {bookingType === "hour" && (
                <p className="text-2xl font-bold text-blue-600">₹{product.pricePerHour} / hour</p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div><span className="font-semibold">Category:</span> {product.category}</div>
              <div><span className="font-semibold">Model:</span> {product.model}</div>
              <div><span className="font-semibold">Range:</span> {controlRange}</div>
              <div><span className="font-semibold">Speed:</span> {speed}</div>
              <div><span className="font-semibold">Weight:</span> {weight}</div>
              <div><span className="font-semibold">Battery:</span> {batteryLife}</div>
              {cameraQuality && (
                <div><span className="font-semibold">Camera:</span> {cameraQuality}</div>
              )}
              {payloadCapacity && (
                <div><span className="font-semibold">Payload:</span> {payloadCapacity}</div>
              )}
              {sprayCapacity && (
                <div><span className="font-semibold">Spray:</span> {sprayCapacity}</div>
              )}
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Useful for:</span> {usefulUses}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Features:</span> {additionalSpecs}
            </p>
          </div>
          <div className="p-6 border-t">
            <h2 className="text-xl font-semibold mb-4">Book This Drone</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter delivery address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Booking Type</label>
                <select
                  value={bookingType}
                  onChange={(e) => setBookingType(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="hour">Hour</option>
                  <option value="day">Day</option>
                  <option value="month">Month</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input
                  type="number"
                  value={bookingDuration}
                  onChange={(e) => setBookingDuration(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {bookingType === "hour" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={startHour}
                      onChange={(e) => setStartHour(e.target.value)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="time"
                      value={endHour}
                      onChange={(e) => setEndHour(e.target.value)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="mt-6 flex justify-between items-center">
              <p className="text-2xl font-bold text-gray-800">Total: ₹{totalPrice.toLocaleString()}</p>
              <button
                onClick={handleBookNow}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
              >
                <FaCartPlus />
                <span>Book Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;