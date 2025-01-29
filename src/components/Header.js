import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaInfoCircle,
  FaSignInAlt,
  FaUserPlus,
  FaShoppingCart,
  FaSignOutAlt,
  FaProductHunt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { auth } from "../Authentication/firebaseConfig";

const Header = ({
  isLoggedIn,
  setIsLoggedIn,
  userType,
  cartItems,
  setSearchTerm,
  products,
}) => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [activeSection, setActiveSection] = useState(""); // To track the active section

  useEffect(() => {
    setCartCount(cartItems.reduce((acc, item) => acc + item.quantity, 0));
  }, [cartItems]);

  useEffect(() => {
    if (isLoggedIn) {
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
      const currentUser = storedUsers.find(
        (user) => user.email === auth.currentUser.email
      );
      if (currentUser) {
        setUserDetails(currentUser);
      }
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/login");
    setMenuOpen(false);
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length >= 2) {
      const filteredSuggestions = products.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (product) => {
    if (userType === "admin") {
      const productElement = document.getElementById(`product-${product.id}`);
      if (productElement) {
        productElement.scrollIntoView({ behavior: "smooth" });
      } else {
        console.log("Product element not found");
      }
    } else {
      navigate(`/product/${product.id}`, { state: { product } });
    }
    setSuggestions([]);
    setMenuOpen(false);
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
    setActiveSection(sectionId); // Set the active section
  };

  const handleProductClick = () => {
    if (userType === "admin") {
      const formSection = document.getElementById("add-product-form");
      if (formSection) {
        formSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/user-dashboard");
    }
    setMenuOpen(false);
  };

  const handleCartClick = () => {
    navigate("/cart");
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="bg-gray-800 bo text-white p-4 flex justify-between items-center shadow-lg fixed top-0 left-0 w-full z-50">
      {/* Logo and Title */}
      <div className="flex items-center">
        <img
            src="https://img.freepik.com/premium-photo/delivery-drone-online-delivery-concept-sydney-opera-house-ai-generated_599862-1237.jpg"
            alt="Logo"
            className="h-12 w-12 mr-2 rounded-full object-cover"
        />
        {!menuOpen && <h1 className="text-xl font-bold">Drone Delivery Service</h1>}
      </div>

      {/* Search Bar (Only for Logged-in Users) */}
      {isLoggedIn && (
        <div className={`relative flex-1 mx-4 ${menuOpen ? "hidden" : "flex"}`}>
          <input
            type="text"
            placeholder="Search for a product..."
            onChange={handleSearch}
            className="p-2 rounded bg-gray-700 text-white w-full"
          />
          {suggestions.length > 0 && (
            <ul className="absolute bg-white text-black w-full mt-1 rounded shadow-lg">
              {suggestions.map((product) => (
                <li
                  key={product.id}
                  onClick={() => handleSuggestionClick(product)}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                >
                  {product.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Mobile Menu Toggle */}
      <button onClick={toggleMenu} className="md:hidden absolute top-4 right-4">
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Navigation */}
      <nav className={`flex-col md:flex-row md:flex items-center space-x-4 ${menuOpen ? "flex" : "hidden"} md:flex`}>
        {/* Links */}
        {!isLoggedIn && (
          <button
            onClick={() => navigate("/")}
            className="text-white flex items-center space-x-2 px-2 py-1 text-sm hover:text-gray-300"
            >
            <FaHome />
            <span>Home</span>
          </button>
        )}
        {isLoggedIn && userType !== "admin" && (
          <button
            onClick={handleProductClick}
            className="text-white flex items-center space-x-2 px-2 py-1 text-sm hover:text-gray-300"
            >
            <FaProductHunt />
            <span>Products</span>
          </button>
        )}
        {!isLoggedIn && (
          <>
            <button
              onClick={() => navigate("/login")}
              className="text-white flex items-center space-x-2 px-2 py-1 text-sm hover:text-gray-300"
              >
              <FaSignInAlt />
              <span>Login</span>
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="text-white flex items-center space-x-2 px-2 py-1 text-sm hover:text-gray-300"
              >
              <FaUserPlus />
              <span>Sign Up</span>
            </button>
          </>
        )}
        <button
          onClick={() => scrollToSection("about-us")}
          className="text-white flex items-center space-x-2 px-2 py-1 text-sm hover:text-gray-300"
          >
           
          <FaInfoCircle />
          <span>About Us</span>
        </button>

        {isLoggedIn && userType !== "admin" && (
          <button
            onClick={handleCartClick}
            className="text-white flex items-center space-x-2 px-2 py-1 text-sm hover:text-gray-300"
            >
            <FaShoppingCart />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="bg-red-600 flex items-center space-x-2 text-white rounded-full px-2 py-1 text-xs ml-2">
                {cartCount}
              </span>
            )}
          </button>
        )}
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="bg-red-600 flex items-center space-x-2  text-white px-2 py-1 text-sm rounded hover:bg-red-700"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
