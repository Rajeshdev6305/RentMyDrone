import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MainBody from "./components/MainBody";
import LoginPage from "./pages/LoginPage";
import Signup from "./pages/SignUpPage";
import CartPage from "./pages/CartPage";
import PaymentPage from "./pages/PaymentPage";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import "./index.css"; // Ensure Tailwind CSS is imported
import "./App.css"; // Import App.css for custom styles
import ProductDetailsPage from "./pages/ProductDetailsPage";
// import LoadingSpinner from "./components/LoadingSpinner"; // Import LoadingSpinner component

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // User login state
  const [userType, setUserType] = useState(""); // Can be "user" or "admin"
  const [cartItems, setCartItems] = useState([]); // Cart items state
  const [products, setProducts] = useState([]); // Products state
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [currentAdmin, setCurrentAdmin] = useState(""); // Current admin state

  useEffect(() => {
    // Mock data for products
    const productList = [
      {
        id: 1,
        name: "Marriage Drone X1",
        model: "X1",
        description: "High quality drone for marriage events",
        pricePerHour: 15,
        pricePerDay: 100,
        pricePerMonth: 2500,
        category: "Marriage",
        image: "marriage drone x1.jpg",
      },
      // {
      //   id: 2,
      //   name: "Marriage Drone X2",
      //   model: "X2",
      //   description: "Advanced drone for marriage events",
      //   pricePerHour: 20,
      //   pricePerDay: 120,
      //   pricePerMonth: 3000,
      //   category: "Marriage",
      //   image:"marriage drone x2.jpg",
      // },
      // {
      //   id: 3,
      //   name: "Marriage Drone X3",
      //   model: "X3",
      //   description: "Premium drone for marriage events",
      //   pricePerHour: 25,
      //   pricePerDay: 150,
      //   pricePerMonth: 3500,
      //   category: "Marriage",
      //   image: "marriage drone x3.jpg",
      // },
      // {
      //   id: 4,
      //   name: "Marriage Drone X4",
      //   model: "X4",
      //   description: "Luxury drone for marriage events",
      //   pricePerHour: 30,
      //   pricePerDay: 180,
      //   pricePerMonth: 4000,
      //   category: "Marriage",
      //   image: "marriage drone x4.jpg",    
      //   },
      // {
      //   id: 5,
      //   name: "Marriage Drone X5",
      //   model: "X5",
      //   description: "Exclusive drone for marriage events",
      //   pricePerHour: 35,
      //   pricePerDay: 200,
      //   pricePerMonth: 4500,
      //   category: "Marriage",
      //   image: "marriage drone x5.jpg",      },
      // {
      //   id: 6,
      //   name: "Food Delivery Drone X1",
      //   model: "X1",
      //   description: "High quality drone for food delivery",
      //   pricePerHour: 10,
      //   pricePerDay: 60,
      //   pricePerMonth: 1500,
      //   category: "Food Delivery",
      //   image: "food drone x1.jpg",
      // },
      // {
      //   id: 7,
      //   name: "Food Delivery Drone X2",
      //   model: "X2",
      //   description: "Advanced drone for food delivery",
      //   pricePerHour: 12,
      //   pricePerDay: 70,
      //   pricePerMonth: 1800,
      //   category: "Food Delivery",
      //   image: "food drone x2.jpg",
      // },
      // {
      //   id: 8,
      //   name: "Food Delivery Drone X3",
      //   model: "X3",
      //   description: "Premium drone for food delivery",
      //   pricePerHour: 15,
      //   pricePerDay: 80,
      //   pricePerMonth: 2000,
      //   category: "Food Delivery",
      //   image: "food drone x3.jpg",
      // },
      // {
      //   id: 9,
      //   name: "Food Delivery Drone X4",
      //   model: "X4",
      //   description: "Luxury drone for food delivery",
      //   pricePerHour: 18,
      //   pricePerDay: 90,
      //   pricePerMonth: 2200,
      //   category: "Food Delivery",
      //   image: "food drone x4.jpg",
      // },
      // {
      //   id: 10,
      //   name: "Food Delivery Drone X5",
      //   model: "X5",
      //   description: "Exclusive drone for food delivery",
      //   pricePerHour: 20,
      //   pricePerDay: 100,
      //   pricePerMonth: 2500,
      //   category: "Food Delivery",
      //   image: "food drone x5.jpg",
      // },
      // {
      //   id: 11,
      //   name: "Farming Drone X1",
      //   model: "X1",
      //   description: "High quality drone for farming",
      //   pricePerHour: 12,
      //   pricePerDay: 70,
      //   pricePerMonth: 1800,
      //   category: "Farming",
      //   image: "farming drone x1.jpg",
      // },
      // {
      //   id: 12,
      //   name: "Farming Drone X2",
      //   model: "X2",
      //   description: "Advanced drone for farming",
      //   pricePerHour: 15,
      //   pricePerDay: 80,
      //   pricePerMonth: 2000,
      //   category: "Farming",
      //   image: "farming drone x2.jpg",
      // },
      // {
      //   id: 13,
      //   name: "Farming Drone X3",
      //   model: "X3",
      //   description: "Premium drone for farming",
      //   pricePerHour: 18,
      //   pricePerDay: 90,
      //   pricePerMonth: 2200,
      //   category: "Farming",
      //   image: "farming drone x3.jpg",
      // },
      // {
      //   id: 14,
      //   name: "Farming Drone X4",
      //   model: "X4",
      //   description: "Luxury drone for farming",
      //   pricePerHour: 20,
      //   pricePerDay: 100,
      //   pricePerMonth: 2500,
      //   category: "Farming",
      //   image: "farming drone x4.jpg",
      // },
      // {
      //   id: 15,
      //   name: "Farming Drone X5",
      //   model: "X5",
      //   description: "Exclusive drone for farming",
      //   pricePerHour: 25,
      //   pricePerDay: 120,
      //   pricePerMonth: 3000,
      //   category: "Farming",
      //   image: "farming drone x5.jpg",
      // },
    ];
    setProducts(productList);
  }, []);

  // const handleRefresh = () => {
  //   return new Promise((resolve) => {
  //     window.location.reload();
  //     resolve();
  //   });
  // };

  return (
    
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-gray-100">
        {/* Header */}
        <Header
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          userType={userType}
          cartItems={cartItems}
          setSearchTerm={setSearchTerm}
          products={products}
        />

        {/* Main Content */}
        <main className="flex-grow p-4 pt-24">
          <Routes>
            {/* Home/Main Body */}
            <Route
              path="/"
              element={
                <MainBody
                  isLoggedIn={isLoggedIn}
                  setCartItems={setCartItems}
                  cartItems={cartItems}
                  products={products}
                  searchTerm={searchTerm}
                />
              }
            />

            {/* Login Page */}
            <Route
              path="/login"
              element={
                <LoginPage
                  setIsLoggedIn={setIsLoggedIn}
                  setUserType={setUserType}
                />
              }
            />

            {/* Signup Page */}
            <Route path="/signup" element={<Signup />} />

            {/* User Dashboard */}
            <Route
              path="/user-dashboard"
              element={
                isLoggedIn && userType === "user" ? (
                  <UserDashboard
                    setIsLoggedIn={setIsLoggedIn}
                    setCartItems={setCartItems}
                    cartItems={cartItems}
                    products={products}
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Admin Dashboard */}
            <Route
              path="/admin"
              element={
                isLoggedIn && userType === "admin" ? (
                  <AdminDashboard
                    products={products}
                    setProducts={setProducts}
                    currentAdmin={currentAdmin} // Pass currentAdmin prop
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Cart Page */}
            <Route
              path="/cart"
              element={
                isLoggedIn ? (
                  <CartPage cartItems={cartItems} setCartItems={setCartItems} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Payment Page */}
            <Route
              path="/payment"
              element={isLoggedIn ? <PaymentPage /> : <Navigate to="/login" />}
            />

            {/* Redirect to Login if no match */}
            <Route path="*" element={<Navigate to="/login" />} />
            <Route
              path="/user-dashboard"
              element={
                <UserDashboard
                  setIsLoggedIn={setIsLoggedIn}
                  setCartItems={setCartItems}
                  cartItems={cartItems}
                  products={products}
                />
              }
            />
            <Route
              path="/product/:id"
              element={<ProductDetailsPage setCartItems={setCartItems} />}
            />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
};

export default App; 

