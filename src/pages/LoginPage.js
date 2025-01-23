// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { auth } from "../Authentication/firebaseConfig"; // Replace with the correct path to your Firebase config
// import { signInWithEmailAndPassword } from "firebase/auth";

// const LoginPage = ({ setIsLoggedIn, setUserType }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [userType, setUserTypeInput] = useState("user");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const userCredential = await signInWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );

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
import { auth } from "../Authentication/firebaseConfig"; // Make sure to update the path correctly
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginPage = ({ setIsLoggedIn, setUserType }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserTypeInput] = useState("user");
  const navigate = useNavigate();

  // Default user credentials (can be expanded)
  const defaultUsers = {
    user: {
      email: "user@example.com", // Default email for regular users
      password: "user1234", // Default password for users
    },
    admin: {
      email: "admin@example.com", // Default email for admins
      password: "admin1234", // Default password for admins
    },
  };

  // Handle login logic
  const handleLogin = async (e) => {
    e.preventDefault();

    // If the email matches default users' emails and the password is empty, use default password
    const isDefaultUser = email === defaultUsers[userType]?.email;
    const passwordToUse = password || defaultUsers[userType]?.password;

    if (isDefaultUser && password === passwordToUse) {
      // If it's a default user, directly log them in
      setUserType(userType);
      setIsLoggedIn(true);
      console.log(`${userType} logged in with default credentials`);

      // Redirect based on user type
      if (userType === "admin") {
        navigate("/admin");
      } else {
        navigate("/user-dashboard");
      }
      return;
    }

    try {
      // Firebase Authentication for dynamic users
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Retrieve all users from local storage
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

      // Find the user with the matching email
      const storedUserDetails = storedUsers.find((u) => u.email === email);

      if (
        storedUserDetails &&
        storedUserDetails.password === password &&
        storedUserDetails.userType === userType
      ) {
        setUserType(storedUserDetails.userType);
        setIsLoggedIn(true);

        console.log("User logged in:", user);
        if (storedUserDetails.userType === "admin") {
          navigate("/admin");
        } else {
          navigate("/user-dashboard");
        }
      } else {
        alert("Invalid email, password, or user type. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      alert("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Login</h2>
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
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded"
        >
          Login
        </button>
      </form>
      <p className="text-sm mt-4">
        Don't have an account?{" "}
        <a href="/SignUp" className="text-blue-600">
          Sign Up
        </a>
      </p>
    </div>
  );
};

export default LoginPage;