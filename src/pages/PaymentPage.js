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
    <div className="">
      <button onClick={handleBack} className="bg-gray-600 text-white px-2 py-1 text-sm rounded mb-4">
        Back
      </button>
      <h2 className="text-xl font-bold mb-4">Payment</h2>
      <div className="border p-4 rounded-lg">
        <div>
          <h3 className="text-lg font-bold">{product.name}</h3>
          <p className="text-sm text-blue-600 font-bold">
            {bookingType === "hour" && `$${product.pricePerHour} per hour`}
            {bookingType === "day" && `$${product.pricePerDay} per day`}
            {bookingType === "month" && `$${product.pricePerMonth} per month`}
          </p>
          <p>Booking Duration: {bookingDuration} {bookingType}(s)</p>
          <p>Quantity: {quantity}</p>
          <p>Total Price: ${totalAmount}</p>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-bold">Total Amount: ${totalAmount}</h3>
        </div>
        <form onSubmit={handlePayment} className="space-y-4">
          {/* Payment Method Selection */}
          <div className="flex space-x-4">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
                className="mr-2"
              />
              Pay with Card
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="bank"
                checked={paymentMethod === "bank"}
                onChange={() => setPaymentMethod("bank")}
                className="mr-2"
              />
              Pay with Bank
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="upi"
                checked={paymentMethod === "upi"}
                onChange={() => setPaymentMethod("upi")}
                className="mr-2"
              />
              Pay with UPI
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={paymentMethod === "paypal"}
                onChange={() => setPaymentMethod("paypal")}
                className="mr-2"
              />
              Pay with PayPal
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="paytm"
                checked={paymentMethod === "paytm"}
                onChange={() => setPaymentMethod("paytm")}
                className="mr-2"
              />
              Pay with Paytm
            </label>
          </div>

          {/* Payment Details */}
          {paymentMethod === "card" && (
            <>
              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                value={paymentDetails.cardNumber}
                onChange={handleInputChange}
                className="w-full p-2 border"
                required
              />
              <input
                type="text"
                name="cardHolderName"
                placeholder="Cardholder Name"
                value={paymentDetails.cardHolderName}
                onChange={handleInputChange}
                className="w-full p-2 border"
                required
              />
              <input
                type="text"
                name="expirationDate"
                placeholder="Expiration Date (MM/YY)"
                value={paymentDetails.expirationDate}
                onChange={handleInputChange}
                className="w-full p-2 border"
                required
              />
              <input
                type="text"
                name="cvv"
                placeholder="CVV"
                value={paymentDetails.cvv}
                onChange={handleInputChange}
                className="w-full p-2 border"
                required
              />
            </>
          )}
          {paymentMethod === "bank" && (
            <input
              type="text"
              name="bankAccount"
              placeholder="Bank Account Number"
              value={paymentDetails.bankAccount}
              onChange={handleInputChange}
              className="w-full p-2 border"
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
              className="w-full p-2 border"
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
              className="w-full p-2 border"
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
              className="w-full p-2 border"
              required
            />
          )}

          <button type="submit" className="w-full bg-blue-600 text-white px-2 py-1 text-sm rounded">
            Complete Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
