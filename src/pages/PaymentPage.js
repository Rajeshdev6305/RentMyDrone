import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from 'sweetalert2'; // Import SweetAlert2
import { auth } from "../Authentication/firebaseConfig"; // Import auth

const PaymentPage = ({ currentUserEmail }) => { // Add currentUserEmail as a prop
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
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();
  const location = useLocation();

  // Product details passed via navigation
  const { product, totalPrice, quantity, bookingType, bookingDuration, deliveryAddress, startDate, endDate } = location.state || {};
  const [calculatedTotalPrice, setCalculatedTotalPrice] = useState(totalPrice);

  useEffect(() => {
    if (auth.currentUser && product) {
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
    setLoading(true); // Set loading to true during payment
    Swal.fire('Success', 'Payment successful!', 'success');

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
      userEmail: currentUserEmail, // Add user email to order
    };

    const existingOrders = JSON.parse(localStorage.getItem(`orders_${currentUserEmail}`)) || [];
    existingOrders.push(newOrder);
    localStorage.setItem(`orders_${currentUserEmail}`, JSON.stringify(existingOrders));

    console.log("Order saved:", newOrder);
    console.log("All orders for user:", existingOrders);

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

    setLoading(false); // Set loading to false after payment is complete
    navigate("/my-orders");
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
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p className="text-sm text-blue-600 font-bold mb-2">
                ₹{product.pricePerHour} / hour
              </p>
              <p className="text-sm text-blue-600 font-bold mb-2">
                ₹{product.pricePerDay} / day
              </p>
              <p className="text-sm text-blue-600 font-bold mb-2">
                ₹{product.pricePerMonth} / month
              </p>
              <p>Booking Duration: {bookingDuration} {bookingType}(s)</p>
              <p>Quantity: {quantity}</p>
              <p className="font-semibold">Total Price: ₹{totalAmount}</p>
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
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
