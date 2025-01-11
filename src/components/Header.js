
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   FaHome,
//   FaInfoCircle,
//   FaServicestack,
//   FaEnvelope,
//   FaSignInAlt,
//   FaUserPlus,
//   FaShoppingCart,
//   FaSignOutAlt,
//   FaProductHunt,
//   FaBars,
//   FaTimes,
//   FaUserCircle,
// } from "react-icons/fa";
// import { auth } from "../Authentication/firebaseConfig";

// const Header = ({
//   isLoggedIn,
//   setIsLoggedIn,
//   userType,
//   cartItems,
//   setSearchTerm,
//   products,
// }) => {
//   const navigate = useNavigate();
//   const [cartCount, setCartCount] = useState(0);
//   const [suggestions, setSuggestions] = useState([]);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [profileMenuOpen, setProfileMenuOpen] = useState(false);
//   const [userDetails, setUserDetails] = useState({});

//   useEffect(() => {
//     setCartCount(cartItems.reduce((acc, item) => acc + item.quantity, 0));
//   }, [cartItems]);

//   useEffect(() => {
//     if (isLoggedIn) {
//       const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
//       const currentUser = storedUsers.find(
//         (user) => user.email === auth.currentUser.email
//       );
//       if (currentUser) {
//         setUserDetails(currentUser);
//       }
//     }
//   }, [isLoggedIn]);

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     navigate("/login");
//     setMenuOpen(false);
//   };

//   const handleSearch = (e) => {
//     const term = e.target.value;
//     setSearchTerm(term);
//     if (term.length >= 2) {
//       const filteredSuggestions = products.filter((product) =>
//         product.name.toLowerCase().includes(term.toLowerCase())
//       );
//       setSuggestions(filteredSuggestions);
//     } else {
//       setSuggestions([]);
//     }
//   };

//   const handleSuggestionClick = (product) => {
//     navigate(`/product/${product.id}`, { state: { product } });
//     setSuggestions([]);
//     setMenuOpen(false);
//   };

//   const scrollToSection = (sectionId) => {
//     const section = document.getElementById(sectionId);
//     section.scrollIntoView({ behavior: "smooth" });
//     setMenuOpen(false);
//   };

//   const toggleMenu = () => {
//     setMenuOpen(!menuOpen);
//   };

//   const toggleProfileMenu = () => {
//     setProfileMenuOpen(!profileMenuOpen);
//   };

//   return (
//     <header className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-lg fixed top-0 left-0 w-full z-50">
//       {!menuOpen && <h1 className="text-xl font-bold">Drone Delivery</h1>}
//       {isLoggedIn && (
//         <div
//           className={`relative flex-1 mx-4 ${menuOpen ? "hidden" : "flex"}`}
//         >
//           <input
//             type="text"
//             placeholder="Search for a product..."
//             onChange={handleSearch}
//             className="p-2 rounded bg-gray-700 text-white w-full"
//           />
//           {suggestions.length > 0 && (
//             <ul className="absolute bg-white text-black w-full mt-1 rounded shadow-lg">
//               {suggestions.map((product) => (
//                 <li
//                   key={product.id}
//                   onClick={() => handleSuggestionClick(product)}
//                   className="p-2 hover:bg-gray-200 cursor-pointer"
//                 >
//                   {product.name}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       )}
//       <button onClick={toggleMenu} className="md:hidden absolute top-4 right-4">
//         {menuOpen ? <FaTimes /> : <FaBars />}
//       </button>
//       <nav
//         className={`flex-col md:flex-row md:flex items-center space-x-4 ${
//           menuOpen ? "flex" : "hidden"
//         } md:flex`}
//       >
//         <div
//           className={`flex-col md:flex-row md:flex items-center space-x-4 ${
//             menuOpen ? "flex" : "hidden"
//           } md:flex md:mr-auto`}
//         >
//           <button
//             onClick={() => {
//               navigate("/");
//               setMenuOpen(false);
//             }}
//             className="text-white px-2 py-1 text-sm hover:text-gray-300 transition flex items-center space-x-2 mb-2 md:mb-0"
//           >
//             <FaHome />
//             <span>Home</span>
//           </button>
//           {!isLoggedIn && (
//             <>
//               <button
//                 onClick={() => {
//                   navigate("/login");
//                   setMenuOpen(false);
//                 }}
//                 className="text-white px-2 py-1 text-sm hover:text-gray-300 transition flex items-center space-x-2 mb-2 md:mb-0"
//               >
//                 <FaSignInAlt />
//                 <span>Login</span>
//               </button>
//               <button
//                 onClick={() => {
//                   navigate("/signup");
//                   setMenuOpen(false);
//                 }}
//                 className="text-white px-2 py-1 text-sm hover:text-gray-300 transition flex items-center space-x-2 mb-2 md:mb-0"
//               >
//                 <FaUserPlus />
//                 <span>Sign Up</span>
//               </button>
//             </>
//           )}
//           <button
//             onClick={() => scrollToSection("about-us")}
//             className="text-white px-2 py-1 text-sm hover:text-gray-300 transition flex items-center space-x-2 mb-2 md:mb-0"
//           >
//             <FaInfoCircle />
//             <span>About Us</span>
//           </button>
//           <button
//             onClick={() => scrollToSection("services")}
//             className="text-white px-2 py-1 text-sm hover:text-gray-300 transition flex items-center space-x-2 mb-2 md:mb-0"
//           >
//             <FaServicestack />
//             <span>Services</span>
//           </button>
//           <button
//             onClick={() => scrollToSection("contact-us")}
//             className="text-white px-2 py-1 text-sm hover:text-gray-300 transition flex items-center space-x-2 mb-2 md:mb-0"
//           >
//             <FaEnvelope />
//             <span>Contact Us</span>
//           </button>
//         </div>
//         {isLoggedIn && (
//           <div className="relative">
//             <button
//               onClick={toggleProfileMenu}
//               className="text-white px-2 py-1 text-sm hover:text-gray-300 transition flex items-center space-x-2 mb-2 md:mb-0"
//             >
//               <FaUserCircle />
//               <span>Profile</span>
//             </button>
//             {profileMenuOpen && (
//               <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg">
//                 <div className="p-4">
//                   {userDetails && (
//                     <>
//                       <p className="text-sm">{userDetails.userType}</p>
//                       <p className="font-bold">{userDetails.username}</p>
//                       <p className="text-sm">{userDetails.email}</p>
//                     </>
//                   )}
//                 </div>
//                 <button
//                   onClick={handleLogout}
//                   className="w-full bg-red-600 text-white px-2 py-1 text-sm rounded hover:bg-red-700 transition flex items-center space-x-2"
//                 >
//                   <FaSignOutAlt />
//                   <span>Logout</span>
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </nav>
//     </header>
//   );
// };

// export default Header;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaInfoCircle,
  FaServicestack,
  FaEnvelope,
  FaSignInAlt,
  FaUserPlus,
  FaShoppingCart,
  FaSignOutAlt,
  FaProductHunt,
  FaBars,
  FaTimes,
  FaUserCircle,
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
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({});

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
    navigate(`/product/${product.id}`, { state: { product } });
    setSuggestions([]);
    setMenuOpen(false);
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-lg fixed top-0 left-0 w-full z-50">
      {!menuOpen && <h1 className="text-xl font-bold">Drone Delivery</h1>}
      {isLoggedIn && (
        <div
          className={`relative flex-1 mx-4 ${menuOpen ? "hidden" : "flex"}`}
        >
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
      <button onClick={toggleMenu} className="md:hidden absolute top-4 right-4 ">
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>
      <nav
        className={`flex-col md:flex-row md:flex items-center  space-x-4 ${menuOpen ? "flex" : "hidden"} md:flex`}
      >
        <div
          className={`flex-col md:flex-row md:flex items-center space-x-4  ${
            menuOpen ? "flex" : "hidden"
          } md:flex md:mr-auto`}
        >
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
          {!isLoggedIn && (
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
        </div>
        {isLoggedIn && (
          <div className="relative">
            <button
              onClick={toggleProfileMenu}
              className="text-white px-2 py-1 text-sm hover:text-gray-300 transition flex items-center space-x-2 mb-2 md:mb-0"
            >
              <FaUserCircle />
              <span>Profile</span>
            </button>
            {profileMenuOpen && (
              <div className="absolute right-0 top-8 md:top-10  md:right-0 mt-2 w-48  bg-white text-black rounded shadow-lg z-50">
                <div className="p-4">
                  {userDetails && (
                    <>
                      <p className="text-sm">{userDetails.userType}</p>
                      <p className="font-bold">{userDetails.username}</p>
                      <p className="text-sm">{userDetails.email}</p>
                    </>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 text-white px-2 py-1 text-sm rounded hover:bg-red-700 transition flex items-center space-x-2"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
