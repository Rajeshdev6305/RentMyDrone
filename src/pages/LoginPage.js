import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../Authentication/firebaseConfig"; // Ensure path is correct
import { signInWithEmailAndPassword } from "firebase/auth";
import Swal from 'sweetalert2'; // Import SweetAlert2

const LoginPage = ({ setIsLoggedIn, setUserType }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    type: "user", // Default user type
  });
  const [loading, setLoading] = useState(false); // Manage loading state
  const navigate = useNavigate();

  // Default placeholders for each user type
  const placeholders = {
    user: {
      email: "user@gmail.com",
      password: "user1234",
    },
    admin: {
      email: "admin@gmail.com",
      password: "admin1234",
    },
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle login logic
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading state

    try {
      const { email, password, type } = formData;

      // Check if the user is a default user
      if (email === placeholders[type].email && password === placeholders[type].password) {
        setUserType(type);
        setIsLoggedIn(true);
        navigate(type === "admin" ? "/admin" : "/user-dashboard");
        return;
      }

      // Attempt Firebase login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Check if auth.currentUser is not null
      if (!auth.currentUser) {
        throw new Error("No authenticated user found.");
      }

      // Safely retrieve stored users from local storage
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

      // Check if storedUsers is an array
      if (!Array.isArray(storedUsers)) {
        throw new Error("Stored users data is invalid.");
      }

      // Find the user with the matching email
      const storedUser = storedUsers.find((u) => u.email === email);

      if (storedUser && storedUser.password === password && storedUser.userType === type) {
        setUserType(storedUser.userType);
        setIsLoggedIn(true);
        navigate(storedUser.userType === "admin" ? "/admin" : "/user-dashboard");
      } else {
        Swal.fire('Error', 'Invalid email, password, or user type. Please try again.', 'error');
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      Swal.fire('Error', 'Invalid email or password. Please try again.', 'error');
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50">
      {/* Left side: Image + Text */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex justify-center items-center p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-blue-800">
            RentMyDrone
          </h1>
          <p className="text-lg mb-6 text-gray-700">
            Experience fast and reliable delivery powered by drones. Login to track your orders and more.
          </p>
          <img
            src="https://img.freepik.com/premium-photo/delivery-drone-online-delivery-concept-sydney-opera-house-ai-generated_599862-1237.jpg"
            alt="Login Illustration"
            className="object-cover w-full h-full max-w-xl rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Right side: Form */}
      <div className="w-full md:w-1/2 lg:w-1/3 p-8 flex justify-center items-center">
        <div className="p-8 max-w-md bg-white rounded-lg shadow-xl w-full hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-800">Login</h2>
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6">
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <input
                type="email"
                name="email"
                placeholder={placeholders[formData.type].email}
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                required
              />
              <input
                type="password"
                name="password"
                placeholder={placeholders[formData.type].password}
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                required
              />
              <button
                type="submit"
                className={`w-full bg-blue-600 text-white px-4 py-3 rounded-lg ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                } hover:bg-blue-700 transition duration-300`}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          )}
          <p className="text-sm mt-6 text-center">
            Don't have an account?{" "}
            <a href="/SignUp" className="text-blue-600 font-semibold hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;