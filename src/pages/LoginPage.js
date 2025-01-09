import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginPage = ({ setIsLoggedIn, setUserType }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserTypeInput] = useState("user");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Retrieve user details from local storage
      const storedUserDetails = JSON.parse(localStorage.getItem(email));
      if (storedUserDetails && storedUserDetails.password === password && storedUserDetails.userType === userType) {
        setUserType(storedUserDetails.userType);
        setIsLoggedIn(true);

        console.log("User logged in:", user);
        if (storedUserDetails.userType === "admin") {
          navigate("/admin");
        } else {
          navigate("/user-dashboard");
        }
      } else {
        alert("Invalid email or password. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      alert("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold mb-4">Login</h2>
      </div>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border"
          required
        />
        <select
          value={userType}
          onChange={(e) => setUserTypeInput(e.target.value)}
          className="w-full p-2 border"
          required
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="w-full bg-blue-600 text-white px-2 py-1 text-sm rounded">
          Login
        </button>
      </form>
      <p className="text-sm mt-4">
        Don't have an account? <a href="/signup" className="text-blue-600">Sign Up</a>
      </p>
    </div>
  );
};

export default LoginPage;
