import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../Authentication/firebaseConfig"; // Replace with the correct path to your Firebase config
import { createUserWithEmailAndPassword } from "firebase/auth";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    type: "user", // Default to "user"
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // Retrieve existing users from local storage
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

      // Check if the email already exists
      const existingUser = storedUsers.find(
        (storedUser) => storedUser.email === formData.email
      );

      if (existingUser) {
        alert("User with this email already exists.");
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

      alert("Account created successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Error during sign-up:", error.message);
      alert("Error occurred during sign-up. Please try again.");
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
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>
      <form onSubmit={handleSignUp} className="space-y-4">
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full p-2 border"
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
          className="w-full p-2 border"
          required
        />
        <input
          type="email"
          name="email"
          placeholder={placeholders[formData.type].email}
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder={placeholders[formData.type].phone}
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-2 border"
          required
        />
        <input
          type="password"
          name="password"
          placeholder={placeholders[formData.type].password}
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder={placeholders[formData.type].password}
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full p-2 border"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded"
        >
          Sign Up
        </button>
      </form>
      <p className="text-sm mt-4">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600">
          Login
        </a>
      </p>
    </div>
  );
};

export default SignUpPage;



// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { auth } from "../Authentication/firebaseConfig"; // Replace with the correct path to your Firebase config
// import { createUserWithEmailAndPassword } from "firebase/auth";

// const SignUpPage = () => {
//   const [formData, setFormData] = useState({
//     type: "user", // Default to "user"
//     username: "",   
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSignUp = async (e) => {
//     e.preventDefault();

//     if (formData.password !== formData.confirmPassword) {
//       alert("Passwords do not match!");
//       return;
//     }

//     try {
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         formData.email,
//         formData.password
//       );

//       const user = userCredential.user;

//       // Retrieve existing users from local storage
//       const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

//       // Check if the email already exists
//       const existingUser = storedUsers.find(
//         (storedUser) => storedUser.email === formData.email
//       );

//       if (existingUser) {
//         alert("User with this email already exists.");
//         return;
//       }

//       // Save new user data to local storage
//       const newUser = {
//         userType: formData.type,
//         username: formData.username,
//         email: formData.email,
//         phone: formData.phone,
//         password: formData.password,
//       };

//       storedUsers.push(newUser);
//       localStorage.setItem("users", JSON.stringify(storedUsers));

//       alert("Account created successfully!");
//       navigate("/login");
//     } catch (error) {
//       console.error("Error during sign-up:", error.message);
//       alert("Error occurred during sign-up. Please try again.");
//     }
//   };

//   return (
//     <div className="p-4 max-w-md mx-auto">
//       <h2 className="text-xl font-bold mb-4">Sign Up</h2>
//       <form onSubmit={handleSignUp} className="space-y-4">
//       <select
//           name="type"
//           value={formData.type}
//           onChange={handleChange}
//           className="w-full p-2 border"
//           required
//         >
//           <option value="user">User</option>
//           <option value="admin">Admin</option>
//         </select>
        
//         <input
//           type="text"
//           name="username"
//           placeholder="User"
//           value={formData.username}
//           onChange={handleChange}
//           className="w-full p-2 border"
//           required
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="user@gmail.com"
//           value={formData.email}
//           onChange={handleChange}
//           className="w-full p-2 border"
//           required
//         />
//         <input
//           type="text"
//           name="phone"
//           placeholder="1234567890"
//           value={formData.phone}
//           onChange={handleChange}
//           className="w-full p-2 border"
//           required
//         />
      
//         <input
//           type="password"
//           name="password"
//           placeholder="user1234"
//           value={formData.password}
//           onChange={handleChange}
//           className="w-full p-2 border"
//           required
//         />
//         <input
//           type="password"
//           name="confirmPassword"
//           placeholder="user1234"
//           value={formData.confirmPassword}
//           onChange={handleChange}
//           className="w-full p-2 border"
//           required
//         />
//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Sign Up
//         </button>
//       </form>
//       <p className="text-sm mt-4">
//         Already have an account?{" "}
//         <a href="/login" className="text-blue-600">
//           Login
//         </a>
//       </p>
//     </div>
//   );
// };

// export default SignUpPage;