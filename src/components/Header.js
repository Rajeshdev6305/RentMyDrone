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
import { signOut } from "firebase/auth";

const Header = ({
  isLoggedIn,
  setIsLoggedIn,
  userType,
  cartItems = [],
  setSearchTerm,
  products,
  setUserType,
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
        JSON.parse(localStorage.getItem(`orders_${auth.currentUser.email}`)) || [];
      const userOrders = storedOrders.filter(
        (order) => order.userEmail === auth.currentUser.email
      );
      setOrderCount(userOrders.length);
    } else {
      setOrderCount(0);
    }
  }, [isLoggedIn]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setUserType("");
      localStorage.removeItem("redirectPath"); // Clear redirect path on logout
      navigate("/");
      setMenuOpen(false);
      setProfileMenuOpen(false);
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
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
        setTimeout(() => productElement.classList.remove("bg-yellow-100"), 2000);
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
    if (!isLoggedIn) {
      navigate("/login");
    } else if (userType === "admin") {
      const formSection = document.getElementById("add-product-form");
      if (formSection) formSection.scrollIntoView({ behavior: "smooth" });
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
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate("/cart");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  const handleOrdersClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate("/my-orders");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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
    localStorage.setItem("redirectPath", window.location.pathname); // Store current path
    navigate("/login");
  };

  const handleSignUpClick = () => {
    if (window.location.pathname === "/signup") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/signup");
    }
    setMenuOpen(false);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const toggleProfileMenu = () => setProfileMenuOpen(!profileMenuOpen);

  const handleAddProductClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else if (userType === "admin") {
      if (window.location.pathname === "/admin") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/admin");
      }
    }
    setMenuOpen(false);
  };

  const handleManageOrdersClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else if (userType === "admin") {
      navigate("/admin/manage-orders");
    }
    setMenuOpen(false);
  };

  return (
    <header className="bg-gray-800 text-white py-3 px-4 flex justify-between items-center shadow-lg fixed top-0 left-0 w-full z-50">
      {/* Logo Section */}
      <div className="flex items-center space-x-2">
        <img
          src="https://img.freepik.com/premium-photo/delivery-drone-online-delivery-concept-sydney-opera-house-ai-generated_599862-1237.jpg"
          alt="Logo"
          className="h-10 w-10 rounded-full object-cover border-2 border-white"
        />
        <h1 className="text-lg font-bold block sm:hidden lg:block">RentMyDrone</h1>
      </div>

      {/* Search Bar (Visible only when logged in) */}
      {isLoggedIn && (
        <SearchBar
          handleSearch={handleSearch}
          suggestions={suggestions}
          handleSuggestionClick={handleSuggestionClick}
          menuOpen={menuOpen}
        />
      )}

      {/* Navigation and Profile */}
      <div className="flex items-center space-x-2">
        <MobileMenuToggle menuOpen={menuOpen} toggleMenu={toggleMenu} />

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center">
          <nav className={`flex md:items-center md:space-x-3 ${menuOpen ? "hidden" : "flex"}`}>
            {/* Show Home only when not logged in */}
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
                label="Orders"
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
            {isLoggedIn && userType === "admin" && (
              <NavLink
                icon={<FaClipboardList />}
                label="Manage Orders"
                onClick={handleManageOrdersClick}
                isActive={activeSection === "manage-orders"}
              />
            )}
            <NavLink
              icon={<FaInfoCircle />}
              label="About Us"
              onClick={() => scrollToSection("about-us")}
            />
          </nav>

          {/* Profile Menu (Desktop) */}
          {isLoggedIn && (
            <div className="relative ml-3">
              <button
                onClick={toggleProfileMenu}
                className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded-full transition-colors duration-200"
              >
                <FaUserCircle size={28} />
              </button>
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 px-4 z-50">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <FaSignOutAlt className="mr-2" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav className="md:hidden absolute top-16 left-0 w-full bg-gray-800 p-4 space-y-4">
          {/* Show Home only when not logged in */}
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
          {isLoggedIn && userType === "admin" && (
            <NavLink
              icon={<FaClipboardList />}
              label="Manage Orders"
              onClick={handleManageOrdersClick}
              isActive={activeSection === "manage-orders"}
            />
          )}
          {isLoggedIn && (
            <NavLink
              icon={<FaSignOutAlt />}
              label="Logout"
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700"
            />
          )}
        </nav>
      )}
    </header>
  );
};

// Rest of the components remain unchanged
const SearchBar = ({ handleSearch, suggestions, handleSuggestionClick, menuOpen }) => (
  <div
    className={`relative flex-1 mx-2 sm:mx-4 md:mx-6 ${
      menuOpen ? "hidden sm:flex" : "flex"
    } max-w-xs sm:max-w-xl md:max-w-2xl`}
  >
    <input
      type="text"
      placeholder="Search for a product..."
      onChange={handleSearch}
      className="w-full py-2 px-4 rounded-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition-all duration-200 text-sm sm:text-base"
    />
    {suggestions.length > 0 && (
      <ul className="absolute top-full left-0 w-full bg-gray-700 text-white mt-1 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
        {suggestions.map((product) => (
          <li
            key={product.id}
            onClick={() => handleSuggestionClick(product)}
            className="p-3 hover:bg-gray-600 cursor-pointer transition-colors duration-200 text-sm"
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
    className="md:hidden text-white hover:text-gray-300 transition-colors duration-200 p-2"
  >
    {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
  </button>
);

const NavLink = ({ icon, label, onClick, isActive, badge = null, className = "" }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-between w-full md:w-auto space-x-2 px-4 py-2 md:px-3 md:py-1.5 text-sm rounded-lg transition-colors duration-200 ${
      isActive ? "bg-gray-700" : "hover:bg-gray-700"
    } ${className}`}
  >
    <div className="flex items-center space-x-2">
      {icon}
      <span>{label}</span>
    </div>
    {badge !== null && (
      <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
        {badge}
      </span>
    )}
  </button>
);

export default Header;