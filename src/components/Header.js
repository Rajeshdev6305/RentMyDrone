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
  FaClipboardList,
  FaUserCircle,
} from "react-icons/fa";
import { auth } from "../Authentication/firebaseConfig";

const Header = ({
  isLoggedIn,
  setIsLoggedIn,
  userType,
  cartItems = [],
  setSearchTerm,
  products,
}) => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  useEffect(() => {
    setCartCount(cartItems.reduce((acc, item) => acc + item.quantity, 0));
  }, [cartItems]);

  useEffect(() => {
    if (isLoggedIn && auth.currentUser) {
      const storedOrders =
        JSON.parse(localStorage.getItem(`orders_${auth.currentUser.email}`)) ||
        [];
      const userOrders = storedOrders.filter(
        (order) => order.userEmail === auth.currentUser.email
      );
      setOrderCount(userOrders.length);
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    auth.signOut().then(() => {
      setIsLoggedIn(false);
      navigate("/login");
      setMenuOpen(false);
      setProfileMenuOpen(false);
    }).catch((error) => {
      console.error("Error signing out: ", error);
    });
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
        productElement.classList.add("bg-yellow-100");
        setTimeout(() => {
          productElement.classList.remove("bg-yellow-100");
        }, 2000);
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
    setActiveSection(sectionId);
  };

  const handleProductClick = () => {
    if (userType === "admin") {
      const formSection = document.getElementById("add-product-form");
      if (formSection) {
        formSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      if (window.location.pathname === "/user-dashboard") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/user-dashboard");
      }
    }
    setMenuOpen(false);
  };

  const handleCartClick = () => {
    navigate("/cart");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleOrdersClick = () => {
    navigate("/my-orders");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleHomeClick = () => {
    if (window.location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
    setMenuOpen(false);
  };

  const handleLoginClick = () => {
    if (window.location.pathname === "/login") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/login");
    }
    setMenuOpen(false);
  };

  const handleSignUpClick = () => {
    if (window.location.pathname === "/signup") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/signup");
    }
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  const handleAddProductClick = () => {
    if (window.location.pathname === "/admin") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/admin");
    }
    setMenuOpen(false);
  };

  return (
    <header className="bg-gray-600 text-white p-4 flex justify-between items-center shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="flex items-center">
        <img
          src="https://img.freepik.com/premium-photo/delivery-drone-online-delivery-concept-sydney-opera-house-ai-generated_599862-1237.jpg"
          alt="Logo"
          className="h-12 w-12 mr-2 rounded-full object-cover border-2 border-white"
        />
        <h1 className="text-xl font-bold text-white hidden lg:block">
          RentMyDrone
        </h1>
      </div>

      {isLoggedIn && (
        <SearchBar
          handleSearch={handleSearch}
          suggestions={suggestions}
          handleSuggestionClick={handleSuggestionClick}
          menuOpen={menuOpen}
        />
      )}

      <div className="flex items-center space-x-4">
        <MobileMenuToggle menuOpen={menuOpen} toggleMenu={toggleMenu} />

        <nav
          className={`flex-col md:flex-row md:flex items-center space-x-4 ${
            menuOpen ? "flex" : "hidden"
          } md:flex md:space-x-2 md:space-y-0 space-y-4 md:justify-between justify-evenly w-full`}
        >
          {!isLoggedIn && (
            <NavLink
              icon={<FaHome />}
              label="Home"
              onClick={handleHomeClick}
              isActive={activeSection === "home"}
            />
          )}
          {isLoggedIn && userType !== "admin" && (
            <NavLink
              icon={<FaProductHunt />}
              label="Products"
              onClick={handleProductClick}
              isActive={activeSection === "products"}
            />
          )}
          {!isLoggedIn && (
            <>
              <NavLink
                icon={<FaSignInAlt />}
                label="Login"
                onClick={handleLoginClick}
                isActive={activeSection === "login"}
              />
              <NavLink
                icon={<FaUserPlus />}
                label="Sign Up"
                onClick={handleSignUpClick}
                isActive={activeSection === "signup"}
              />
            </>
          )}
          <NavLink
            icon={<FaInfoCircle />}
            label="About Us"
            onClick={() => scrollToSection("about-us")}
          />
          {isLoggedIn && userType !== "admin" && (
            <NavLink
              icon={<FaShoppingCart />}
              label="Cart"
              onClick={handleCartClick}
              isActive={activeSection === "cart"}
              badge={cartCount > 0 ? cartCount : null}
            />
          )}
          {isLoggedIn && userType !== "admin" && (
            <NavLink
              icon={<FaClipboardList />}
              label="My Orders"
              onClick={handleOrdersClick}
              isActive={activeSection === "my-orders"}
              badge={orderCount > 0 ? orderCount : null}
            />
          )}
          {isLoggedIn && userType === "admin" && (
            <NavLink
              icon={<FaProductHunt />}
              label="Add Product"
              onClick={handleAddProductClick}
              isActive={activeSection === "add-product"}
            />
          )}
          {isLoggedIn && (
            <div className="relative hidden md:block">
              <button
                onClick={toggleProfileMenu}
                className="text-white flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <FaUserCircle size={24} />
              </button>
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
          {isLoggedIn && (
            <NavLink
              icon={<FaSignOutAlt />}
              label="Logout"
              onClick={handleLogout}
              isActive={activeSection === "logout"}
              className="bg-red-600 hover:bg-red-700 md:hidden"
            />
          )}
        </nav>
      </div>
    </header>
  );
};

const SearchBar = ({
  handleSearch,
  suggestions,
  handleSuggestionClick,
  menuOpen,
}) => (
  <div
    className={`relative flex-1 mx-4 ${
      menuOpen ? "hidden" : "flex"
    } ml-1 mr-7`}
  >
    <input
      type="text"
      placeholder="Search for a product..."
      onChange={handleSearch}
      className="p-2 rounded bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-white placeholder-gray-300"
    />
    {suggestions.length > 0 && (
      <ul className="absolute left-0 bg-gray-700 text-white w-full mt-2 rounded shadow-lg max-h-60 overflow-y-auto z-50 space-y-1">
        {suggestions.map((product) => (
          <li
            key={product.id}
            onClick={() => handleSuggestionClick(product)}
            className="p-2 hover:bg-gray-600 cursor-pointer transition-colors duration-200"
          >
            {product.name}
          </li>
        ))}
      </ul>
    )}
  </div>
);

const MobileMenuToggle = ({ menuOpen, toggleMenu }) => (
  <button
    onClick={toggleMenu}
    className="md:hidden absolute top-4 right-4 text-white hover:text-gray-300 transition-colors duration-200"
  >
    {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
  </button>
);

const NavLink = ({
  icon,
  label,
  onClick,
  isActive,
  badge = null,
  className = "",
}) => (
  <button
    onClick={onClick}
    className={`text-white flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-700 rounded-lg transition-colors duration-200 ${
      isActive ? "bg-gray-700" : ""
    } ${className}`}
  >
    {icon}
    <span>{label}</span>
    {badge !== null && (
      <span className="bg-red-600 text-white rounded-full px-2 py-1 text-xs">
        {badge}
      </span>
    )}
  </button>
);

export default Header