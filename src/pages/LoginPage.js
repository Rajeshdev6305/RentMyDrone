// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { auth } from "../Authentication/firebaseConfig"; // Make sure to update the path correctly
// import { signInWithEmailAndPassword } from "firebase/auth";

// const LoginPage = ({ setIsLoggedIn, setUserType }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [userType, setUserTypeInput] = useState("user");
//   const navigate = useNavigate();

//   // Default user credentials (can be expanded)
//   const defaultUsers = {
//     user: {
//       email: "user@gmail.com", // Default email for regular users
//       password: "user1234", // Default password for users
//     },
//     admin: {
//       email: "admin@.com", // Default email for admins
//       password: "admin1234", // Default password for admins
//     },
//   };

//   // Handle login logic
//   const handleLogin = async (e) => {
//     e.preventDefault();

//     // If the email matches default users' emails and the password is empty, use default password
//     const isDefaultUser = email === defaultUsers[userType]?.email;
//     const passwordToUse = password || defaultUsers[userType]?.password;

//     if (isDefaultUser && password === passwordToUse) {
//       // If it's a default user, directly log them in
//       setUserType(userType);
//       setIsLoggedIn(true);
//       console.log(`${userType} logged in with default credentials`);

//       // Redirect based on user type
//       if (userType === "admin") {
//         navigate("/admin");
//       } else {
//         navigate("/user-dashboard");
//       }
//       return;
//     }

//     try {
//       // Firebase Authentication for dynamic users
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       // Retrieve all users from local storage
//       const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

//       // Find the user with the matching email
//       const storedUserDetails = storedUsers.find((u) => u.email === email);

//       if (
//         storedUserDetails &&
//         storedUserDetails.password === password &&
//         storedUserDetails.userType === userType
//       ) {
//         setUserType(storedUserDetails.userType);
//         setIsLoggedIn(true);

//         console.log("User logged in:", user);
//         if (storedUserDetails.userType === "admin") {
//           navigate("/admin");
//         } else {
//           navigate("/user-dashboard");
//         }
//       } else {
//         alert("Invalid email, password, or user type. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error during login:", error.message);
//       alert("Invalid email or password. Please try again.");
//     }
//   };

//   return (
//     <div className="p-4 max-w-md mx-auto">
//       <h2 className="text-xl font-bold mb-4">Login</h2>
//       <form onSubmit={handleLogin} className="space-y-4">
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full p-2 border"
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-2 border"
//           required
//         />
//         <select
//           value={userType}
//           onChange={(e) => setUserTypeInput(e.target.value)}
//           className="w-full p-2 border"
//           required
//         >
//           <option value="user">User</option>
//           <option value="admin">Admin</option>
//         </select>
//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Login
//         </button>
//       </form>
//       <p className="text-sm mt-4">
//         Don't have an account?{" "}
//         <a href="/SignUp" className="text-blue-600">
//           Sign Up
//         </a>
//       </p>
//     </div>
//   );
// };

// export default LoginPage;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../Authentication/firebaseConfig"; // Ensure path is correct
import { signInWithEmailAndPassword } from "firebase/auth";

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
      const user = userCredential.user;

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
        alert("Invalid email, password, or user type. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      alert("Invalid email or password. Please try again.");
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center">
      {/* Left side: Image + Text */}
      <div className="w-full md:w-2/3 lg:w-1/2 flex justify-center items-center text-center p-4 mb-6 md:mb-0">
        <div>
          <h1 className="text-3xl font-bold mb-4 text-blue-600">
            Drone Delivery Service
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
      <div className="w-full md:w-1/2 lg:w-1/3 p-4 flex justify-center items-center bg-gray-100 ">
        <div className="p-6 max-w-md bg-white rounded-lg shadow-xl w-full hover:shadow-2xl transition-shadow duration-300 ">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Login</h2>
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
              className={`w-full bg-blue-600 text-white px-4 py-3 rounded-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''} hover:bg-blue-700 transition duration-300`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
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
