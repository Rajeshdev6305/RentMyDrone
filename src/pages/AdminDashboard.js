// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";

// const AdminDashboard = ({ products, setProducts, currentAdmin }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     model: "",
//     pricePerHour: "",
//     pricePerDay: "",
//     pricePerMonth: "",
//     controlRange: "",
//     type: "",
//     speed: "",
//     weight: "",
//     cameraQuality: "",
//     payloadCapacity: "",
//     sprayCapacity: "",
//     batteryLife: "",
//     usefulUses: "",
//     additionalSpecs: "",
//     description: "",
//     category: "",
//     image: "",
//   });
//   const [imagePreview, setImagePreview] = useState(null);
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [viewMyProducts, setViewMyProducts] = useState(false);
//   const navigate = useNavigate();
//   const imageInputRef = useRef(null);
//   const formRef = useRef(null);

//   useEffect(() => {
//     // Load products from localStorage
//     const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
//     setProducts(storedProducts);
//   }, [setProducts]);

//   useEffect(() => {
//     // Persist products to localStorage whenever they are updated
//     localStorage.setItem("products", JSON.stringify(products));
//   }, [products]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData({ ...formData, image: reader.result });
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleAddProduct = (e) => {
//     e.preventDefault();
//     if (editingProduct) {
//       // Update existing product
//       const updatedProducts = products.map((product) =>
//         product.id === editingProduct.id ? { ...product, ...formData } : product
//       );
//       setProducts(updatedProducts);
//       setEditingProduct(null);
//       alert("Product updated successfully!");
//     } else {
//       // Add new product
//       const newProduct = {
//         id: Date.now(),
//         ...formData,
//         addedBy: currentAdmin,
//       };
//       const updatedProducts = [...products, newProduct].sort((a, b) =>
//         a.category.localeCompare(b.category)
//       );
//       setProducts(updatedProducts);
//       alert("Product added successfully!");
//     }
//     // Reset form
//     setFormData({
//       name: "",
//       model: "",
//       pricePerHour: "",
//       pricePerDay: "",
//       pricePerMonth: "",
//       controlRange: "",
//       type: "",
//       speed: "",
//       weight: "",
//       cameraQuality: "",
//       payloadCapacity: "",
//       sprayCapacity: "",
//       batteryLife: "",
//       usefulUses: "",
//       additionalSpecs: "",
//       description: "",
//       category: "",
//       image: "",
//     });
//     setImagePreview(null);
//     imageInputRef.current.value = null;
//   };

//   const handleEditProduct = (product) => {
//     setEditingProduct(product);
//     setFormData(product);
//     setImagePreview(product.image);
//     formRef.current.scrollIntoView({ behavior: "smooth" });
//   };

//   const handleDeleteProduct = (productId) => {
//     const updatedProducts = products.filter(
//       (product) => product.id !== productId
//     );
//     setProducts(updatedProducts);
//     alert("Product deleted successfully!");
//   };

//   const groupedProducts = products.reduce((acc, product) => {
//     if (!acc[product.category]) {
//       acc[product.category] = [];
//     }
//     acc[product.category].push(product);
//     return acc;
//   }, {});

//   const filteredProducts = viewMyProducts
//     ? products.filter((product) => product.addedBy === currentAdmin)
//     : products;

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">
//         {editingProduct ? "Edit Product" : "Add New Product"}
//       </h2>
//       <form onSubmit={handleAddProduct} className="space-y-4" ref={formRef}>
//         <input
//           type="text"
//           name="name"
//           placeholder="Product Name"
//           value={formData.name}
//           onChange={handleChange}
//           className="w-full p-2 border"
//           required
//         />
//         <input
//           type="text"
//           name="model"
//           placeholder="Model"
//           value={formData.model}
//           onChange={handleChange}
//           className="w-full p-2 border"
//           required
//         />
//         <input
//           type="number"
//           name="pricePerHour"
//           placeholder="Price Per Hour"
//           value={formData.pricePerHour}
//           onChange={handleChange}
//           className="w-full p-2 border"
//           required
//         />
//         <input
//           type="number"
//           name="pricePerDay"
//           placeholder="Price Per Day"
//           value={formData.pricePerDay}
//           onChange={handleChange}
//           className="w-full p-2 border"
//           required
//         />
//         <textarea
//           name="description"
//           placeholder="Description"
//           value={formData.description}
//           onChange={handleChange}
//           className="w-full p-2 border"
//           required
//         />
//         <input
//           type="text"
//           name="category"
//           placeholder="Category"
//           value={formData.category}
//           onChange={handleChange}
//           className="w-full p-2 border"
//           required
//         />
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleImageChange}
//           ref={imageInputRef}
//           className="w-full p-2 border"
//         />
//         {imagePreview && (
//           <img
//             src={imagePreview}
//             alt="Preview"
//             className="w-80 h-100 object-cover mb-2 rounded"
//           />
//         )}
//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white px-2 py-1 text-sm rounded"
//         >
//           {editingProduct ? "Update Product" : "Add Product"}
//         </button>
//       </form>
//       <div className="flex justify-between items-center mt-8 mb-4">
//         <h2 className="text-xl font-bold">Available Products</h2>
//         <button
//           onClick={() => setViewMyProducts(!viewMyProducts)}
//           className="bg-blue-600 text-white px-2 py-1 text-sm rounded hover:bg-blue-700 transition flex items-center space-x-2"
//         >
//           {viewMyProducts ? <FaEyeSlash /> : <FaEye />}
//           <span>
//             {viewMyProducts ? "View All Products" : "View My Products"}
//           </span>
//         </button>
//       </div>
//       {Object.keys(groupedProducts).map((category) => (
//         <div key={category}>
//           <h3 className="text-lg font-bold mb-4">{category}</h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
//             {groupedProducts[category]
//               .filter((product) => filteredProducts.includes(product))
//               .map((product) => (
//                 <div
//                   key={product.id}
//                   className="border p-4 shadow hover:shadow-lg rounded-lg transition"
//                 >
//                   <img
//                     src={
//                       product.image.startsWith("data:image")
//                         ? product.image
//                         : `${process.env.PUBLIC_URL}/${product.image}`
//                     }
//                     alt={product.name}
//                     className="w-full h-64 object-cover mb-2 rounded"
//                   />
//                   <h3 className="text-lg font-bold">{product.name}</h3>
//                   <p className="text-sm">{product.description}</p>
//                   <p className="text-sm text-blue-600 font-bold">
//                     ${product.pricePerDay} per day
//                   </p>
//                   <p className="text-xs text-gray-600">{product.category}</p>
//                   {product.addedBy === currentAdmin && (
//                     <div className="flex justify-between mt-2">
//                       <button
//                         onClick={() => handleEditProduct(product)}
//                         className="bg-yellow-500 text-white px-2 py-1 text-sm rounded mr-2 flex items-center space-x-2"
//                       >
//                         <FaEdit />
//                         <span>Edit</span>
//                       </button>
//                       <button
//                         onClick={() => handleDeleteProduct(product.id)}
//                         className="bg-red-500 text-white px-2 py-1 text-sm rounded flex items-center space-x-2"
//                       >
//                         <FaTrash />
//                         <span>Delete</span>
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useState, useRef, useEffect } from "react";
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";

const AdminDashboard = ({ products, setProducts, currentAdmin }) => {
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewMyProducts, setViewMyProducts] = useState(false);
  const imageInputRef = useRef(null);
  const formRef = useRef(null);

  // Load and persist products to localStorage
  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(storedProducts);
  }, [setProducts]);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add or update a product
  const handleAddOrUpdateProduct = (e) => {
    e.preventDefault();

    if (editingProduct) {
      // Update existing product
      const updatedProducts = products.map((product) =>
        product.id === editingProduct.id ? { ...product, ...formData } : product
      );
      setProducts(updatedProducts);
      alert("Product updated successfully!");
    } else {
      // Add new product
      const newProduct = {
        id: Date.now(),
        ...formData,
        addedBy: currentAdmin,
      };
      setProducts((prev) => [...prev, newProduct].sort((a, b) => a.category.localeCompare(b.category)));
      alert("Product added successfully!");
    }

    // Reset form
    resetForm();
  };

  // Reset form fields
  const resetForm = () => {
    setFormData({});
    setImagePreview(null);
    setEditingProduct(null);
    if (imageInputRef.current) imageInputRef.current.value = null;
  };

  // Handle edit and delete actions
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setImagePreview(product.image);
    formRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleDeleteProduct = (productId) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
    alert("Product deleted successfully!");
  };

  // Filter products by admin view
  const filteredProducts = viewMyProducts
    ? products.filter((product) => product.addedBy === currentAdmin)
    : products;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {editingProduct ? "Edit Product" : "Add New Product"}
      </h2>
      <form onSubmit={handleAddOrUpdateProduct} className="space-y-4" ref={formRef}>
        {/* Dynamic Form Fields */}
        {[
          { name: "name", type: "text", placeholder: "Product Name" },
          { name: "model", type: "text", placeholder: "Model" },
          { name: "pricePerHour", type: "number", placeholder: "Price Per Hour" },
          { name: "pricePerDay", type: "number", placeholder: "Price Per Day" },
          { name: "description", type: "textarea", placeholder: "Description" },
          { name: "category", type: "text", placeholder: "Category" },
        ].map(({ name, type, placeholder }) => (
          <div key={name}>
            {type === "textarea" ? (
              <textarea
                name={name}
                placeholder={placeholder}
                value={formData[name] || ""}
                onChange={handleChange}
                className="w-full p-2 border"
                required
              />
            ) : (
              <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={formData[name] || ""}
                onChange={handleChange}
                className="w-full p-2 border"
                required
              />
            )}
          </div>
        ))}
        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={imageInputRef}
          className="w-full p-2 border"
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="w-80 h-100 object-cover mb-2 rounded"
          />
        )}
        <button type="submit" className="w-full bg-blue-600 text-white px-2 py-1 text-sm rounded">
          {editingProduct ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Product List */}
      <div className="flex justify-between items-center mt-8 mb-4">
        <h2 className="text-xl font-bold">Available Products</h2>
        <button
          onClick={() => setViewMyProducts(!viewMyProducts)}
          className="bg-blue-600 text-white px-2 py-1 text-sm rounded flex items-center"
        >
          {viewMyProducts ? <FaEyeSlash /> : <FaEye />}
          <span>{viewMyProducts ? "View All Products" : "View My Products"}</span>
        </button>
      </div>
      <div>
        {filteredProducts.map((product) => (
          <div key={product.id} className="border p-4 shadow rounded-lg mb-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover rounded mb-2"
            />
            <h3 className="text-lg font-bold">{product.name}</h3>
            <p className="text-sm">{product.description}</p>
            <p className="text-blue-600 font-bold">${product.pricePerDay} per day</p>
            <div className="flex justify-between mt-2">
              <button
                onClick={() => handleEditProduct(product)}
                className="bg-yellow-500 text-white px-2 py-1 text-sm rounded"
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="bg-red-500 text-white px-2 py-1 text-sm rounded"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
