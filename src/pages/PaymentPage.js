import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { auth } from "../Authentication/firebaseConfig";
import { FaCreditCard, FaUniversity, FaMobileAlt, FaPaypal, FaArrowLeft } from "react-icons/fa";

const PaymentPage = ({ currentUserEmail }) => {
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardHolderName: "",
    expirationDate: "",
    cvv: "",
    bankAccount: "",
    upiId: "",
    paypalEmail: "",
    paytmNumber: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { product, totalPrice, quantity, bookingType, bookingDuration, deliveryAddress, startDate, endDate } = location.state || {};
  const [calculatedTotalPrice, setCalculatedTotalPrice] = useState(totalPrice);

  useEffect(() => {
    if (auth.currentUser && product) {
      let price = 0;
      if (bookingType === "hour") price = bookingDuration * product.pricePerHour * quantity;
      else if (bookingType === "day") price = bookingDuration * product.pricePerDay * quantity;
      else if (bookingType === "month") price = bookingDuration * product.pricePerMonth * quantity;
      setCalculatedTotalPrice(price);
    }
  }, [product, bookingType, bookingDuration, quantity]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">No product selected for payment!</p>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      Swal.fire({
        icon: "success",
        title: "Payment Successful!",
        text: "Your order has been placed.",
        timer: 1500,
        showConfirmButton: false,
      });

      const newOrder = {
        id: Date.now(),
        product,
        totalPrice: calculatedTotalPrice,
        quantity,
        bookingType,
        bookingDuration,
        deliveryAddress,
        startDate,
        endDate,
        paymentStatus: "Paid",
        userEmail: currentUserEmail,
      };

      const existingOrders = JSON.parse(localStorage.getItem(`orders_${currentUserEmail}`)) || [];
      localStorage.setItem(`orders_${currentUserEmail}`, JSON.stringify([...existingOrders, newOrder]));

      setPaymentDetails({
        cardNumber: "",
        cardHolderName: "",
        expirationDate: "",
        cvv: "",
        bankAccount: "",
        upiId: "",
        paypalEmail: "",
        paytmNumber: "",
      });

      setLoading(false);
      navigate("/my-orders");
    }, 1000); // Simulate payment processing delay
  };

  const handleBack = () => navigate(-1);

  const paymentMethods = [
    { id: "card", label: "Credit/Debit Card", icon: <FaCreditCard /> },
    { id: "bank", label: "Bank Transfer", icon: <FaUniversity /> },
    { id: "upi", label: "UPI", icon: <FaMobileAlt /> },
    { id: "paypal", label: "PayPal", icon: <FaPaypal /> },
    { id: "paytm", label: "Paytm", icon: <FaMobileAlt /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Complete Your Payment</h1>
        <button
          onClick={handleBack}
          className="flex items-center bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-300"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
        {/* Order Summary */}
        <div className="lg:w-1/3 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex justify-between">
              <span className="font-medium">Product:</span>
              <span>{product.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Booking Type:</span>
              <span>{bookingType.charAt(0).toUpperCase() + bookingType.slice(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Duration:</span>
              <span>{bookingDuration} {bookingType}(s)</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Quantity:</span>
              <span>{quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Delivery Address:</span>
              <span>{deliveryAddress}</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="font-semibold text-gray-800">Total Amount:</span>
              <span className="font-bold text-blue-600">₹{calculatedTotalPrice}</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="lg:w-2/3 bg-white rounded-lg shadow-md p-6 relative">
          {loading && (
            <div className="absolute inset-0 bg-gray-200 bg-opacity-75 flex items-center justify-center rounded-lg">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Payment Details</h2>

          {/* Payment Method Selection */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`flex items-center justify-center p-4 border rounded-lg transition-all duration-300 ${
                  paymentMethod === method.id
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{method.icon}</span>
                <span className="text-sm font-medium">{method.label}</span>
              </button>
            ))}
          </div>

          {/* Payment Form */}
          <form onSubmit={handlePayment} className="space-y-4">
            {paymentMethod === "card" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={paymentDetails.cardNumber}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    name="cardHolderName"
                    placeholder="John Doe"
                    value={paymentDetails.cardHolderName}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                    <input
                      type="text"
                      name="expirationDate"
                      placeholder="MM/YY"
                      value={paymentDetails.expirationDate}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      placeholder="123"
                      value={paymentDetails.cvv}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {paymentMethod === "bank" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account Number</label>
                <input
                  type="text"
                  name="bankAccount"
                  placeholder="Enter your bank account number"
                  value={paymentDetails.bankAccount}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>
            )}

            {paymentMethod === "upi" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                <input
                  type="text"
                  name="upiId"
                  placeholder="example@upi"
                  value={paymentDetails.upiId}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>
            )}

            {paymentMethod === "paypal" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PayPal Email</label>
                <input
                  type="email"
                  name="paypalEmail"
                  placeholder="example@paypal.com"
                  value={paymentDetails.paypalEmail}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>
            )}

            {paymentMethod === "paytm" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paytm Number</label>
                <input
                  type="text"
                  name="paytmNumber"
                  placeholder="Enter your Paytm number"
                  value={paymentDetails.paytmNumber}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold disabled:bg-blue-400"
            >
              {loading ? "Processing..." : `Pay ₹${calculatedTotalPrice}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;