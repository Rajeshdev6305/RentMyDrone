import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PaymentPage = () => {
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
  const navigate = useNavigate();
  const location = useLocation();

  // Product details passed via navigation
  const { product, totalPrice, quantity, bookingType, bookingDuration, deliveryAddress, startDate, endDate } = location.state || {};
  const [calculatedTotalPrice, setCalculatedTotalPrice] = useState(totalPrice);

  useEffect(() => {
    if (product) {
      let price = 0;
      if (bookingType === "hour") {
        price = bookingDuration * product.pricePerHour * quantity;
      } else if (bookingType === "day") {
        price = bookingDuration * product.pricePerDay * quantity;
      } else if (bookingType === "month") {
        price = bookingDuration * product.pricePerMonth * quantity;
      }
      setCalculatedTotalPrice(price);
    }
  }, [product, bookingType, bookingDuration, quantity]);

  if (!product) {
    return <p>No product selected for payment!</p>;
  }

  const handleInputChange = (e) => {
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
  };

  const handlePayment = (e) => {
    e.preventDefault();
    alert("Payment successful!");
    // Empty all inputs
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
  };

  const handleBack = () => {
    navigate(-1); // Go back to product details page
  };

  const totalAmount = calculatedTotalPrice;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4">
      {/* Adjusted the parent div to align "Back" button to the left */}
      <div className="w-full flex justify-start mb-6">
        <button onClick={handleBack} className="bg-gray-600 text-white px-4 py-2 rounded">
          Back
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 w-full sm:w-4/5 lg:w-2/3">
        <h2 className="text-2xl font-bold mb-4 text-center">Payment</h2>
        <div className="mb-4">
          <h3 className="text-xl font-semibold">{product.name}</h3>
          <p className="text-sm text-blue-600 font-bold mb-2">
            {bookingType === "hour" && `$${product.pricePerHour} per hour`}
            {bookingType === "day" && `$${product.pricePerDay} per day`}
            {bookingType === "month" && `$${product.pricePerMonth} per month`}
          </p>
          <p>Booking Duration: {bookingDuration} {bookingType}(s)</p>
          <p>Quantity: {quantity}</p>
          <p className="font-semibold">Total Price: ${totalAmount}</p>
        </div>

        {/* Payment Method Selection */}
        <div className="flex flex-wrap justify-center mb-4">
          {["card", "bank", "upi", "paypal", "paytm"].map((method) => (
            <label key={method} className="mr-6 flex items-center cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value={method}
                checked={paymentMethod === method}
                onChange={() => setPaymentMethod(method)}
                className="mr-2"
              />
              {`Pay with ${method.charAt(0).toUpperCase() + method.slice(1)}`}
            </label>
          ))}
        </div>

        {/* Payment Details Form */}
        <form onSubmit={handlePayment} className="space-y-4">
          {paymentMethod === "card" && (
            <>
              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                value={paymentDetails.cardNumber}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-md"
                required
              />
              <input
                type="text"
                name="cardHolderName"
                placeholder="Cardholder Name"
                value={paymentDetails.cardHolderName}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-md"
                required
              />
              <div className="flex space-x-4">
                <input
                  type="text"
                  name="expirationDate"
                  placeholder="Expiration Date (MM/YY)"
                  value={paymentDetails.expirationDate}
                  onChange={handleInputChange}
                  className="w-1/2 p-3 border rounded-md"
                  required
                />
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={paymentDetails.cvv}
                  onChange={handleInputChange}
                  className="w-1/2 p-3 border rounded-md"
                  required
                />
              </div>
            </>
          )}

          {paymentMethod === "bank" && (
            <input
              type="text"
              name="bankAccount"
              placeholder="Bank Account Number"
              value={paymentDetails.bankAccount}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-md"
              required
            />
          )}

          {paymentMethod === "upi" && (
            <input
              type="text"
              name="upiId"
              placeholder="UPI ID"
              value={paymentDetails.upiId}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-md"
              required
            />
          )}

          {paymentMethod === "paypal" && (
            <input
              type="email"
              name="paypalEmail"
              placeholder="PayPal Email"
              value={paymentDetails.paypalEmail}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-md"
              required
            />
          )}

          {paymentMethod === "paytm" && (
            <input
              type="text"
              name="paytmNumber"
              placeholder="Paytm Number"
              value={paymentDetails.paytmNumber}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-md"
              required
            />
          )}

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md mt-6">
            Complete Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
