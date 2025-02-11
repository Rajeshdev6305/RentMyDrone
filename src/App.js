import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MainBody from "./components/MainBody";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import CartPage from "./pages/CartPage";
import PaymentPage from "./pages/PaymentPage";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import { auth } from "./Authentication/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import "./index.css";
import "./App.css";

const ScrollToTop = () => {
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Initializing default products");
    const defaultProducts = [
      {
        id: 1,
        name: "Marriage Drone X1",
        model: "X1",
        description: "High quality drone for marriage events",
        pricePerHour: 300,
        pricePerDay: 1000,
        pricePerMonth: 25000,
        category: "Marriage",
        image: "marriage drone x1.jpg",
        addedBy: "default",
      },
      {
        id: 2,
        name: "Marriage Drone X2",
        model: "X2",
        description: "Advanced drone for marriage events",
        pricePerHour: 350,
        pricePerDay: 1200,
        pricePerMonth: 30000,
        category: "Marriage",
        image: "marriage drone x2.jpg",
        addedBy: "default",
      },
      {
        id: 3,
        name: "Marriage Drone X3",
        model: "X3",
        description: "Premium drone for marriage events",
        pricePerHour: 400,
        pricePerDay: 1400,
        pricePerMonth: 35000,
        category: "Marriage",
        image: "marriage drone x3.jpg",
        addedBy: "default",
      },
      {
        id: 4,
        name: "Marriage Drone X4",
        model: "X4",
        description: "Luxury drone for marriage events",
        pricePerHour: 450,
        pricePerDay: 1500,
        pricePerMonth: 37500,
        category: "Marriage",
        image: "marriage drone x4.jpg",
        addedBy: "default",
      },
      {
        id: 5,
        name: "Marriage Drone X5",
        model: "X5",
        description: "Exclusive drone for marriage events",
        pricePerHour: 500,
        pricePerDay: 1600,
        pricePerMonth: 40000,
        category: "Marriage",
        image: "marriage drone x5.jpg",
        addedBy: "default",
      },
      {
        id: 6,
        name: "Food Delivery Drone X1",
        model: "X1",
        description: "High quality drone for food delivery",
        pricePerHour: 200,
        pricePerDay: 800,
        pricePerMonth: 20000,
        category: "Food Delivery",
        image: "food drone x1.jpg",
        addedBy: "default",
      },
      {
        id: 7,
        name: "Food Delivery Drone X2",
        model: "X2",
        description: "Advanced drone for food delivery",
        pricePerHour: 300,
        pricePerDay: 900,
        pricePerMonth: 22000,
        category: "Food Delivery",
        image: "food drone x2.jpg",
        addedBy: "default",
      },
      {
        id: 8,
        name: "Food Delivery Drone X3",
        model: "X3",
        description: "Premium drone for food delivery",
        pricePerHour: 400,
        pricePerDay: 1000,
        pricePerMonth: 25000,
        category: "Food Delivery",
        image: "food drone x3.jpg",
        addedBy: "default",
      },
      {
        id: 9,
        name: "Food Delivery Drone X4",
        model: "X4",
        description: "Luxury drone for food delivery",
        pricePerHour: 500,
        pricePerDay: 1200,
        pricePerMonth: 30000,
        category: "Food Delivery",
        image: "food drone x4.jpg",
        addedBy: "default",
      },
      {
        id: 10,
        name: "Food Delivery Drone X5",
        model: "X5",
        description: "Exclusive drone for food delivery",
        pricePerHour: 600,
        pricePerDay: 1500,
        pricePerMonth: 35000,
        category: "Food Delivery",
        image: "food drone x5.jpg",
        addedBy: "default",
      },
      {
        id: 11,
        name: "Farming Drone X1",
        model: "X1",
        description: "High quality drone for farming",
        pricePerHour: 500,
        pricePerDay: 1500,
        pricePerMonth: 35000,
        category: "Farming",
        image: "farming drone x1.jpg",
        addedBy: "default",
      },
      {
        id: 12,
        name: "Farming Drone X2",
        model: "X2",
        description: "Advanced drone for farming",
        pricePerHour: 600,
        pricePerDay: 1700,
        pricePerMonth: 40000,
        category: "Farming",
        image: "farming drone x2.jpg",
        addedBy: "default",
      },
      {
        id: 13,
        name: "Farming Drone X3",
        model: "X3",
        description: "Premium drone for farming",
        pricePerHour: 700,
        pricePerDay: 1900,
        pricePerMonth: 45000,
        category: "Farming",
        image: "farming drone x3.jpg",
        addedBy: "default",
      },
      {
        id: 14,
        name: "Farming Drone X4",
        model: "X4",
        description: "Luxury drone for farming",
        pricePerHour: 800,
        pricePerDay: 2100,
        pricePerMonth: 50000,
        category: "Farming",
        image: "farming drone x4.jpg",
        addedBy: "default",
      },
      {
        id: 15,
        name: "Farming Drone X5",
        model: "X5",
        description: "Exclusive drone for farming",
        pricePerHour: 1000,
        pricePerDay: 2500,
        pricePerMonth: 60000,
        category: "Farming",
        image: "farming drone x5.jpg",
        addedBy: "default",
      },
    ];

    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
    console.log("Stored products:", storedProducts);

    const mergedProducts = [
      ...defaultProducts,
      ...storedProducts.filter(
        (storedProduct) =>
          !defaultProducts.some(
            (defaultProduct) => defaultProduct.id === storedProduct.id
          )
      ),
    ];

    setProducts(mergedProducts);
    console.log("Merged products:", mergedProducts);
  }, []);

  useEffect(() => {
    console.log("Updating local storage with products:", products);
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    console.log("Checking login state");
    const storedLoginState = JSON.parse(localStorage.getItem("loginState"));
    if (storedLoginState) {
      setIsLoggedIn(storedLoginState.isLoggedIn);
      setUserType(storedLoginState.userType);
      setCurrentUserEmail(storedLoginState.currentUserEmail);
      const storedCartItems =
        JSON.parse(
          localStorage.getItem(`cartItems_${storedLoginState.currentUserEmail}`)
        ) || [];
      setCartItems(storedCartItems);
      setLoading(false);
      console.log("Restored login state:", storedLoginState);
    } else {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsLoggedIn(true);
          const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
          const currentUser = storedUsers.find((u) => u.email === user.email);
          if (currentUser) {
            setUserType(currentUser.userType);
            setCurrentUserEmail(currentUser.email);
            const storedCartItems =
              JSON.parse(
                localStorage.getItem(`cartItems_${currentUser.email}`)
              ) || [];
            setCartItems(storedCartItems);
            console.log("User logged in:", currentUser);
          }
        } else {
          setIsLoggedIn(false);
          setUserType("");
          setCurrentUserEmail("");
          setCartItems([]);
          console.log("User logged out");
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && auth.currentUser) {
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
      const currentUser = storedUsers.find(
        (user) => user.email === auth.currentUser.email
      );
      if (currentUser) {
        setCurrentUserEmail(currentUser.email);
        const storedCartItems =
          JSON.parse(
            localStorage.getItem(`cartItems_${currentUser.email}`)
          ) || [];
        setCartItems(storedCartItems);
        console.log("Restored cart items for user:", currentUser.email);
      }
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem(
        `cartItems_${currentUserEmail}`,
        JSON.stringify(cartItems)
      );
      localStorage.setItem(
        "loginState",
        JSON.stringify({ isLoggedIn, userType, currentUserEmail })
      );
      console.log("Saved login state and cart items");
    } else {
      localStorage.removeItem("loginState");
      console.log("Removed login state");
    }
  }, [cartItems, isLoggedIn, userType, currentUserEmail]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          userType={userType}
          cartItems={cartItems}
          setSearchTerm={setSearchTerm}
          products={products}
          setUserType={setUserType}
        />
        <main className="flex-grow main-content">
          <Routes>
            <Route
              path="/"
              element={
                <MainBody
                  products={products}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  setCartItems={setCartItems}
                  currentUserEmail={currentUserEmail}
                  isLoggedIn={isLoggedIn}
                />
              }
            />
            <Route
              path="/login"
              element={
                isLoggedIn ? (
                  <Navigate
                    to={userType === "admin" ? "/admin" : "/user-dashboard"}
                  />
                ) : (
                  <LoginPage
                    setIsLoggedIn={setIsLoggedIn}
                    setUserType={setUserType}
                  />
                )
              }
            />
            <Route
              path="/signup"
              element={<SignUpPage onSignupSuccess={() => navigate("/login")} />}
            />
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
            <Route
              path="/payment"
              element={
                isLoggedIn ? (
                  <PaymentPage currentUserEmail={currentUserEmail} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/product/:id"
              element={<ProductDetailsPage setCartItems={setCartItems} />}
            />
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
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default App;