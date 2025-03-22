import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../Authentication/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import Swal from "sweetalert2";

const LoginPage = ({ setIsLoggedIn, setUserType }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    type: "user",
  });
  const [loading, setLoading] = useState(false);
  const [loginMode, setLoginMode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const placeholders = {
    user: { email: "user@gmail.com", password: "user1234" },
    admin: { email: "admin@gmail.com", password: "admin1234" },
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { email, password, type } = formData;
      if (email === placeholders[type].email && password === placeholders[type].password) {
        setUserType(type);
        setIsLoggedIn(true);
        localStorage.setItem(
          "loginState",
          JSON.stringify({ isLoggedIn: true, userType: type, currentUserEmail: email })
        );

        const redirectPath = localStorage.getItem("redirectPath") || (type === "admin" ? "/admin" : "/user-dashboard");
        localStorage.removeItem("redirectPath"); // Clear redirect path after use
        navigate(redirectPath);
        return;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

      if (!Array.isArray(storedUsers)) {
        throw new Error("Stored users data is invalid.");
      }

      const storedUser = storedUsers.find((u) => u.email === email);
      if (storedUser && storedUser.password === password && storedUser.userType === type) {
        setUserType(storedUser.userType);
        setIsLoggedIn(true);
        localStorage.setItem(
          "loginState",
          JSON.stringify({ isLoggedIn: true, userType: storedUser.userType, currentUserEmail: email })
        );
        navigate(storedUser.userType === "admin" ? "/admin" : "/user-dashboard");
      } else {
        Swal.fire("Error", "Invalid credentials or user type.", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.message || "Login failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = (type) => {
    setFormData({
      email: placeholders[type].email,
      password: placeholders[type].password,
      type,
    });
    setLoginMode(type === "admin" ? "guestAdmin" : "guestUser");
  };

  const handleSignInClick = () => {
    // Ensure formData is reset to empty when switching to "login" mode
    setFormData({
      email: "",
      password: "",
      type: "user",
    });
    setLoginMode("login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left Side - Branding */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white flex flex-col justify-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold tracking-tight animate-fade-in-down">
              Drone Delivery
            </h1>
            <p className="text-lg opacity-90 animate-fade-in-up">
              Revolutionizing delivery with cutting-edge drone technology. Fast, secure, and eco-friendly.
            </p>
            <div className="relative h-64">
              <img
                src="https://img.freepik.com/premium-photo/delivery-drone-online-delivery-concept-sydney-opera-house-ai-generated_599862-1237.jpg"
                alt="Drone Delivery"
                className="absolute inset-0 w-full h-full object-cover rounded-lg transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center animate-fade-in">
            Welcome Back
          </h2>

          {!loginMode ? (
            <div className="space-y-4">
              <button
                onClick={handleSignInClick} // Updated to use new handler
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transform hover:-translate-y-1 transition-all duration-300 shadow-md"
              >
                Sign In
              </button>
              <button
                onClick={() => handleGuestLogin("user")}
                className="w-full bg-teal-500 text-white py-3 rounded-lg font-semibold hover:bg-teal-600 transform hover:-translate-y-1 transition-all duration-300 shadow-md"
              >
                Guest User Access
              </button>
              <button
                onClick={() => handleGuestLogin("admin")}
                className="w-full bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-indigo-600 transform hover:-translate-y-1 transition-all duration-300 shadow-md"
              >
                Guest Admin Access
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6">
              {loginMode === "login" && (
                <div className="relative">
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    👤
                  </span>
                </div>
              )}
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  ✉️
                </span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  🔒
                </span>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold ${
                  loading ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700"
                } transform hover:-translate-y-1 transition-all duration-300 shadow-md`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" className="opacity-25" fill="none" stroke="white" strokeWidth="4" />
                      <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
              <button
                type="button"
                onClick={() => setLoginMode("")}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transform hover:-translate-y-1 transition-all duration-300"
              >
                Back to Options
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-600 mt-4">
            New here?{" "}
            <a href="/SignUp" className="text-blue-600 font-medium hover:underline">
              Create an Account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;