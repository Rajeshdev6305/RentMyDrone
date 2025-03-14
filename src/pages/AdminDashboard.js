import React, { useState, useRef, useEffect } from "react";
import { FaEdit, FaTrash, FaEye, FaEyeSlash, FaPlus, FaSearch, FaArrowLeft } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";

const AdminDashboard = ({ currentAdmin }) => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "", model: "", pricePerHour: "", pricePerDay: "", pricePerMonth: "",
    controlRange: "", type: "", speed: "", weight: "", cameraQuality: "",
    payloadCapacity: "", sprayCapacity: "", batteryLife: "", usefulUses: "",
    additionalSpecs: "", description: "", category: "", image: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewMyProducts, setViewMyProducts] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const imageInputRef = useRef(null);
  const formRef = useRef(null);
  const productRefs = useRef({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Load products from localStorage on mount
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(storedProducts);
    setLoading(false);

    // Handle search from navigation
    if (location.state?.searchProductId) {
      const productId = location.state.searchProductId;
      setTimeout(() => {
        const productElement = document.querySelector(`[data-product-id="${productId}"]`);
        if (productElement) {
          productElement.scrollIntoView({ behavior: "smooth", block: "center" });
          productElement.classList.add("highlight");
          setTimeout(() => productElement.classList.remove("highlight"), 2000);
        }
      }, 100);
    }
  }, [location.state]);

  // Function to update localStorage and state
  const updateLocalStorage = (updatedProducts) => {
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      let updatedProducts;
      if (editingProduct) {
        updatedProducts = products.map((product) =>
          product.id === editingProduct.id ? { ...product, ...formData } : product
        );
        Swal.fire("Success", "Product updated successfully!", "success");
      } else {
        const newProduct = { id: Date.now(), ...formData, addedBy: currentAdmin };
        updatedProducts = [...products, newProduct].sort((a, b) =>
          a.category.localeCompare(b.category)
        );
        Swal.fire("Success", "Product added successfully!", "success");
      }
      updateLocalStorage(updatedProducts);
      setEditingProduct(null);
      resetForm();
      setIsLoading(false);
    }, 1000);
  };

  const resetForm = () => {
    setFormData({
      name: "", model: "", pricePerHour: "", pricePerDay: "", pricePerMonth: "",
      controlRange: "", type: "", speed: "", weight: "", cameraQuality: "",
      payloadCapacity: "", sprayCapacity: "", batteryLife: "", usefulUses: "",
      additionalSpecs: "", description: "", category: "", image: "",
    });
    setImagePreview(null);
    imageInputRef.current.value = null;
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setImagePreview(product.image);
    formRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleDeleteProduct = (productId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedProducts = products.filter((product) => product.id !== productId);
        updateLocalStorage(updatedProducts);
        Swal.fire("Deleted!", "Product has been deleted.", "success");
      }
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchLower = searchTerm.toLowerCase();
    const matchedProduct = products.find(product => 
      product.name.toLowerCase().includes(searchLower) || 
      product.model.toLowerCase().includes(searchLower)
    );

    if (matchedProduct && productRefs.current[matchedProduct.id]) {
      productRefs.current[matchedProduct.id].scrollIntoView({ 
        behavior: "smooth",
        block: "center"
      });
      
      const element = productRefs.current[matchedProduct.id];
      element.classList.add('highlight');
      setTimeout(() => {
        element.classList.remove('highlight');
      }, 2000);
    } else {
      Swal.fire("Not Found", "No matching product found!", "info");
    }
    setSearchTerm("");
  };

  const groupedProducts = products.reduce((acc, product) => {
    acc[product.category] = acc[product.category] || [];
    acc[product.category].push(product);
    return acc;
  }, {});

  const filteredProducts = viewMyProducts
    ? products.filter((product) => product.addedBy === currentAdmin)
    : products;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <style>
        {`
          .highlight {
            animation: highlightAnimation 2s ease-in-out;
            border-color: #3b82f6;
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
          }
          
          @keyframes highlightAnimation {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
          }
        `}
      </style>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Back to Home
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8" ref={formRef} id="add-product-form">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h2>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={imageInputRef}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-gray-500">
                      <FaPlus className="mx-auto text-2xl mb-2" />
                      <p>Click to upload product image</p>
                      <p className="text-sm">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                name="model"
                placeholder="Model"
                value={formData.model}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="number"
                  name="pricePerHour"
                  placeholder="Price/Hour"
                  value={formData.pricePerHour}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="number"
                  name="pricePerDay"
                  placeholder="Price/Day"
                  value={formData.pricePerDay}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="number"
                  name="pricePerMonth"
                  placeholder="Price/Month"
                  value={formData.pricePerMonth}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                required
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Category</option>
                <option value="Marriage">Marriage</option>
                <option value="Food Delivery">Food Delivery</option>
                <option value="Farming">Farming</option>
                <option value="General">General</option>
              </select>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                ) : editingProduct ? (
                  "Update Product"
                ) : (
                  "Add Product"
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Product Inventory</h2>
            <div className="flex items-center space-x-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 p-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <button type="submit" className="hidden">Search</button>
              </form>
              <button
                onClick={() => setViewMyProducts(!viewMyProducts)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center space-x-2"
              >
                {viewMyProducts ? <FaEyeSlash /> : <FaEye />}
                <span>{viewMyProducts ? "All Products" : "My Products"}</span>
              </button>
            </div>
          </div>

          {Object.keys(groupedProducts).map((category) => (
            <div key={category} className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">{category}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedProducts[category]
                  .filter((product) => filteredProducts.includes(product))
                  .map((product) => (
                    <div
                      key={product.id}
                      ref={(el) => (productRefs.current[product.id] = el)}
                      data-product-id={product.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-300"
                    >
                      <img
                        src={
                          product.image.startsWith("data:image")
                            ? product.image
                            : `${process.env.PUBLIC_URL}/${product.image}`
                        }
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                        onError={(e) => (e.target.src = "/fallback-image.jpg")}
                      />
                      <h4 className="text-lg font-semibold text-gray-800">{product.name}</h4>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                      <div className="text-blue-600 font-medium mb-2">
                        ₹{product.pricePerDay.toLocaleString()} / day
                      </div>
                      <div className="flex justify-between">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-yellow-600 hover:text-yellow-700 flex items-center"
                        >
                          <FaEdit className="mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-700 flex items-center"
                        >
                          <FaTrash className="mr-1" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <p className="text-center text-gray-500 py-8">No products available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;