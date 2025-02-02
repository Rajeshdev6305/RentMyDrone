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
import ProductDetailsPage from "./pages/ProductDetailsPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import { auth } from "./Authentication/firebaseConfig"; // Import auth from Firebase config
import "./index.css"; // Ensure Tailwind CSS is imported
import "./App.css"; // Import App.css for custom styles

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(""); // Can be "user" or "admin"
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  useEffect(() => {
    // Default products
    const defaultProducts = [
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
        addedBy: "default",
      },
      {
        id: 2,
        name: "Marriage Drone X2",
        model: "X2",
        description: "Advanced drone for marriage events",
        pricePerHour: 20,
        pricePerDay: 120,
        pricePerMonth: 3000,
        category: "Marriage",
        image:"marriage drone x2.jpg",
        addedBy: "default",
      },
      {
        id: 3,
        name: "Marriage Drone X3",
        model: "X3",
        description: "Premium drone for marriage events",
        pricePerHour: 25,
        pricePerDay: 150,
        pricePerMonth: 3500,
        category: "Marriage",
        image: "marriage drone x3.jpg",
        addedBy: "default",
      },
      {
        id: 4,
        name: "Marriage Drone X4",
        model: "X4",
        description: "Luxury drone for marriage events",
        pricePerHour: 30,
        pricePerDay: 180,
        pricePerMonth: 4000,
        category: "Marriage",
        image: "marriage drone x4.jpg",    
        addedBy: "default",
        },
      {
        id: 5,
        name: "Marriage Drone X5",
        model: "X5",
        description: "Exclusive drone for marriage events",
        pricePerHour: 35,
        pricePerDay: 200,
        pricePerMonth: 4500,
        category: "Marriage",
        image: "marriage drone x5.jpg",      
        addedBy: "default",
      },
      {
        id: 6,
        name: "Food Delivery Drone X1",
        model: "X1",
        description: "High quality drone for food delivery",
        pricePerHour: 10,
        pricePerDay: 60,
        pricePerMonth: 1500,
        category: "Food Delivery",
        image: "food drone x1.jpg",
        addedBy: "default",
      },
      {
        id: 7,
        name: "Food Delivery Drone X2",
        model: "X2",
        description: "Advanced drone for food delivery",
        pricePerHour: 12,
        pricePerDay: 70,
        pricePerMonth: 1800,
        category: "Food Delivery",
        image: "food drone x2.jpg",
        addedBy: "default",
      },
      {
        id: 8,
        name: "Food Delivery Drone X3",
        model: "X3",
        description: "Premium drone for food delivery",
        pricePerHour: 15,
        pricePerDay: 80,
        pricePerMonth: 2000,
        category: "Food Delivery",
        image: "food drone x3.jpg",
        addedBy: "default",
      },
      {
        id: 9,
        name: "Food Delivery Drone X4",
        model: "X4",
        description: "Luxury drone for food delivery",
        pricePerHour: 18,
        pricePerDay: 90,
        pricePerMonth: 2200,
        category: "Food Delivery",
        image: "food drone x4.jpg",
        addedBy: "default",
      },
      {
        id: 10,
        name: "Food Delivery Drone X5",
        model: "X5",
        description: "Exclusive drone for food delivery",
        pricePerHour: 20,
        pricePerDay: 100,
        pricePerMonth: 2500,
        category: "Food Delivery",
        image: "food drone x5.jpg",
        addedBy: "default",
      },
      {
        id: 11,
        name: "Farming Drone X1",
        model: "X1",
        description: "High quality drone for farming",
        pricePerHour: 12,
        pricePerDay: 70,
        pricePerMonth: 1800,
        category: "Farming",
        image: "farming drone x1.jpg",
        addedBy: "default",
      },
      {
        id: 12,
        name: "Farming Drone X2",
        model: "X2",
        description: "Advanced drone for farming",
        pricePerHour: 15,
        pricePerDay: 80,
        pricePerMonth: 2000,
        category: "Farming",
        image: "farming drone x2.jpg",
        addedBy: "default",
      },
      {
        id: 13,
        name: "Farming Drone X3",
        model: "X3",
        description: "Premium drone for farming",
        pricePerHour: 18,
        pricePerDay: 90,
        pricePerMonth: 2200,
        category: "Farming",
        image: "farming drone x3.jpg",
        addedBy: "default",
      },
      {
        id: 14,
        name: "Farming Drone X4",
        model: "X4",
        description: "Luxury drone for farming",
        pricePerHour: 20,
        pricePerDay: 100,
        pricePerMonth: 2500,
        category: "Farming",
        image: "farming drone x4.jpg",
        addedBy: "default",
      },
      {
        id: 15,
        name: "Farming Drone X5",
        model: "X5",
        description: "Exclusive drone for farming",
        pricePerHour: 25,
        pricePerDay: 120,
        pricePerMonth: 3000,
        category: "Farming",
        image: "farming drone x5.jpg",
        addedBy: "default",
      },
    ];

    // Load products from local storage
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];

    // Merge default products with stored products, avoiding duplicates
    const mergedProducts = [...defaultProducts, ...storedProducts.filter(
      (storedProduct) => !defaultProducts.some(
        (defaultProduct) => defaultProduct.id === storedProduct.id
      )
    )];

    setProducts(mergedProducts);
  }, []);

  useEffect(() => {
    // Store products in local storage whenever they change
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    if (isLoggedIn) {
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
      const currentUser = storedUsers.find(
        (user) => user.email === auth.currentUser.email
      );
      if (currentUser) {
        setCurrentUserEmail(currentUser.email);
        const storedCartItems = JSON.parse(localStorage.getItem(`cartItems_${currentUser.email}`)) || [];
        setCartItems(storedCartItems);
      }
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem(`cartItems_${currentUserEmail}`, JSON.stringify(cartItems));
    }
  }, [cartItems, isLoggedIn, currentUserEmail]);

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
          currentUserEmail={currentUserEmail}
        />

        {/* Main Content */}
        <main className="flex-grow p-4 pt-24">
          <Routes>
            {/* Home Page */}
            <Route
              path="/"
              element={
                <MainBody
                  isLoggedIn={isLoggedIn}
                  setCartItems={setCartItems}
                  cartItems={cartItems}
                  products={products}
                  searchTerm={searchTerm}
                  currentUserEmail={currentUserEmail}
                />
              }
            />

            {/* Authentication Pages */}
            <Route
              path="/login"
              element={
                <LoginPage
                  setIsLoggedIn={setIsLoggedIn}
                  setUserType={setUserType}
                />
              }
            />
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
                    currentUserEmail={currentUserEmail}
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
                    currentUserEmail={currentUserEmail}
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
                  <CartPage
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                    currentUserEmail={currentUserEmail}
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Payment Page */}
            <Route
              path="/payment"
              element={isLoggedIn ? <PaymentPage currentUserEmail={currentUserEmail} /> : <Navigate to="/login" />}
            />

            {/* Product Details Page */}
            <Route
              path="/product/:id"
              element={<ProductDetailsPage setCartItems={setCartItems} />}
            />

            {/* My Orders Page */}
            <Route
              path="/my-orders"
              element={
                isLoggedIn ? (
                  <MyOrdersPage currentUserEmail={currentUserEmail} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Redirect Unknown Routes to Home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
