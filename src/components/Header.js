import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaInfoCircle, FaServicestack, FaEnvelope, FaSignInAlt, FaUserPlus, FaShoppingCart, FaSignOutAlt, FaProductHunt, FaBars, FaTimes } from "react-icons/fa";

const Header = ({ isLoggedIn, setIsLoggedIn, userType, cartItems, setSearchTerm, products }) => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Update cart count whenever cartItems change
    setCartCount(cartItems.reduce((acc, item) => acc + item.quantity, 0));
  }, [cartItems]);

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
    navigate(`/product/${product.id}`, { state: { product } });
    setSuggestions([]);
    setMenuOpen(false);
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: "smooth" });
    section.classList.add("border-4", "border-white-500");
    setTimeout(() => {
      section.classList.remove("border-4", "border-white-500");
    }, 2000);
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-lg fixed top-0 left-0 w-full z-50">
      {!menuOpen && <h1 className="text-xl font-bold">Drone Delivery </h1>} {/* Hide the title when menu is open */}
      <div className={`relative flex-1 mx-4 ${menuOpen ? 'hidden' : 'block'}`}>
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
      <button onClick={toggleMenu} className="md:hidden absolute top-4 right-4">
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>
      <nav className={`flex-col md:flex-row md:flex items-center space-x-4 ${menuOpen ? 'flex' : 'hidden'} md:flex`}>
        <div className={`flex-col md:flex-row md:flex items-center space-x-4 ${menuOpen ? 'flex' : 'hidden'} md:flex md:mr-auto`}>
          {!isLoggedIn && (
            <button
              onClick={() => {
                navigate("/");
                setMenuOpen(false);
              }}
              className="text-white px-2 py-1 text-sm hover:text-gray-300 transition flex items-center space-x-2 mb-2 md:mb-0"
            >
              <FaHome />
              <span>Home</span>
            </button>
          )}
          <button
            onClick={() => scrollToSection("about-us")}
            className="text-white px-2 py-1 text-sm hover:text-gray-300 transition flex items-center space-x-2 mb-2 md:mb-0"
          >
            <FaInfoCircle />
            <span>About Us</span>
          </button>
          <button
            onClick={() => scrollToSection("services")}
            className="text-white px-2 py-1 text-sm hover:text-gray-300 transition flex items-center space-x-2 mb-2 md:mb-0"
          >
            <FaServicestack />
            <span>Services</span>
          </button>
          <button
            onClick={() => scrollToSection("contact-us")}
            className="text-white px-2 py-1 text-sm hover:text-gray-300 transition flex items-center space-x-2 mb-2 md:mb-0"
          >
            <FaEnvelope />
            <span>Contact Us</span>
          </button>
          {isLoggedIn ? (
            <>
              {userType === "user" && (
                <>
                  <button
                    onClick={() => {
                      navigate("/user-dashboard");
                      setMenuOpen(false);
                    }}
                    className="text-white px-2 py-1 text-sm hover:text-gray-300 transition flex items-center space-x-2 mb-2 md:mb-0"
                  >
                    <FaProductHunt />
                    <span>Products</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate("/cart");
                      setMenuOpen(false);
                    }}
                    className="text-white px-2 py-1 text-sm relative hover:text-gray-300 transition flex items-center space-x-2 mb-2 md:mb-0"
                  >
                    <FaShoppingCart />
                    <span>Cart</span>
                    {cartCount > 0 && (
                      <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-2 text-xs">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </>
              )}
              {userType === "admin" && (
                <button
                  onClick={() => {
                    navigate("/admin");
                    setMenuOpen(false);
                  }}
                  className="text-white px-2 py-1 text-sm hover:text-gray-300 transition flex items-center space-x-2 mb-2 md:mb-0"
                >
                  <FaProductHunt />
                  <span>Add Product</span>
                </button>
              )}
              <button
                onClick={handleLogout}
                className="text-white px-2 py-1 text-sm hover:text-gray-300 transition flex items-center space-x-2 mb-2 md:mb-0"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  navigate("/login");
                  setMenuOpen(false);
                }}
                className="text-white px-2 py-1 text-sm hover:text-gray-300 transition flex items-center space-x-2 mb-2 md:mb-0"
              >
                <FaSignInAlt />
                <span>Login</span>
              </button>
              <button
                onClick={() => {
                  navigate("/signup");
                  setMenuOpen(false);
                }}
                className="text-white px-2 py-1 text-sm hover:text-gray-300 transition flex items-center space-x-2 mb-2 md:mb-0"
              >
                <FaUserPlus />
                <span>Sign Up</span>
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
