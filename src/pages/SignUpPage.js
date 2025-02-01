import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../Authentication/firebaseConfig"; // Replace with the correct path to your Firebase config
import { createUserWithEmailAndPassword } from "firebase/auth";
import Swal from 'sweetalert2'; // Import SweetAlert2

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    type: "user", // Default to "user"
    username: "",  
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true during sign-up

    if (formData.password !== formData.confirmPassword) {
      Swal.fire('Error', 'Passwords do not match!', 'error');
      setLoading(false); // Set loading to false if passwords do not match
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // const user = userCredential.user; // Remove this line if not used

      // Retrieve existing users from local storage
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

      // Check if the email already exists
      const existingUser = storedUsers.find(
        (storedUser) => storedUser.email === formData.email
      );

      if (existingUser) {
        Swal.fire('Error', 'User with this email already exists.', 'error');
        setLoading(false); // Set loading to false if user already exists
        return;
      }

      // Save new user data to local storage
      const newUser = {
        userType: formData.type,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      };

      storedUsers.push(newUser);
      localStorage.setItem("users", JSON.stringify(storedUsers));

      Swal.fire('Success', 'Account created successfully!', 'success');
      navigate("/login");
    } catch (error) {
      console.error("Error during sign-up:", error.message);
      Swal.fire('Error', 'Error occurred during sign-up. Please try again.', 'error');
    } finally {
      setLoading(false); // Set loading to false after sign-up is complete
    }
  };

  // Dynamic placeholders based on the user type
  const placeholders = {
    user: {
      username: "User",
      email: "user@gmail.com",
      phone: "1234567890",
      password: "user1234",
    },
    admin: {
      username: "Admin",
      email: "admin@gmail.com",
      phone: "1234567890",
      password: "admin1234",
    },
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen justify-evenly">
      {/* Left Side Image and Text */}
      <div className="w-full md:w-2/3 lg:w-1/2 flex justify-center items-center text-center p-4 mb-6 md:mb-0">
        <div>
          <h1 className="text-3xl font-bold mb-4 text-blue-600">
            Drone Delivery Service
          </h1>
          <p className="text-lg mb-6 text-gray-700">
            Sign up to experience fast and reliable drone-powered delivery. Manage your account and track deliveries easily!
          </p>
          <img
            src="https://img.freepik.com/premium-photo/delivery-drone-online-delivery-concept-sydney-opera-house-ai-generated_599862-1237.jpg"
            alt="SignUp"
            className="w-full h-full max-w-xl rounded-lg transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>

      {/* Right Side Form */}
      <div className="w-full md:w-1/2 lg:w-1/3 p-4 flex justify-center items-center bg-gray-100">
        <div className="p-6 max-w-md bg-white rounded-lg shadow-xl w-full transition-shadow duration-300 hover:shadow-2xl">
          <h2 className="text-xl font-bold mb-4 text-center">Sign Up</h2>
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2 border transition-all duration-300 hover:border-blue-500"
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <input
                type="text"
                name="username"
                placeholder={placeholders[formData.type].username}
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 border transition-all duration-300 hover:border-blue-500"
                required
              />
              <input
                type="email"
                name="email"
                placeholder={placeholders[formData.type].email}
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border transition-all duration-300 hover:border-blue-500"
                required
              />
              <input
                type="text"
                name="phone"
                placeholder={placeholders[formData.type].phone}
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border transition-all duration-300 hover:border-blue-500"
                required
              />
              <input
                type="password"
                name="password"
                placeholder={placeholders[formData.type].password}
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border transition-all duration-300 hover:border-blue-500"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder={placeholders[formData.type].password}
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 border transition-all duration-300 hover:border-blue-500"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded transition-all duration-300 hover:bg-blue-700"
              >
                Sign Up
              </button>
            </form>
          )}
          <p className="text-sm mt-4 text-center">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;






