import React, { useState, useRef, useEffect } from "react";
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from 'sweetalert2'; // Import SweetAlert2

const AdminDashboard = ({ products, setProducts, currentAdmin }) => {
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    pricePerHour: "",
    pricePerDay: "",
    pricePerMonth: "",
    controlRange: "",
    type: "",
    speed: "",
    weight: "",
    cameraQuality: "",
    payloadCapacity: "",
    sprayCapacity: "",
    batteryLife: "",
    usefulUses: "",
    additionalSpecs: "",
    description: "",
    category: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewMyProducts, setViewMyProducts] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const imageInputRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(storedProducts);
    setLoading(false); // Set loading to false after products are loaded
  }, [setProducts]);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

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
      if (editingProduct) {
        const updatedProducts = products.map((product) =>
          product.id === editingProduct.id ? { ...product, ...formData } : product
        );
        setProducts(updatedProducts);
        setEditingProduct(null);
        Swal.fire('Success', 'Product updated successfully!', 'success');
      } else {
        const newProduct = {
          id: Date.now(),
          ...formData,
          addedBy: currentAdmin,
        };
        const updatedProducts = [...products, newProduct].sort((a, b) =>
          a.category.localeCompare(b.category)
        );
        setProducts(updatedProducts);
        Swal.fire('Success', 'Product added successfully!', 'success');
      }
      setFormData({
        name: "",
        model: "",
        pricePerHour: "",
        pricePerDay: "",
        pricePerMonth: "",
        controlRange: "",
        type: "",
        speed: "",
        weight: "",
        cameraQuality: "",
        payloadCapacity: "",
        sprayCapacity: "",
        batteryLife: "",
        usefulUses: "",
        additionalSpecs: "",
        description: "",
        category: "",
        image: "",
      });
      setImagePreview(null);
      imageInputRef.current.value = null;
      setIsLoading(false);
    }, 1000); // Simulate loading
  };

  const handleEditProduct = (product) => {
    if (product.addedBy !== currentAdmin) {
      Swal.fire('Error', 'You can only edit products that you added.', 'error');
      return;
    }
    setEditingProduct(product);
    setFormData(product);
    setImagePreview(product.image);
    formRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleDeleteProduct = (productId) => {
    const productToDelete = products.find((product) => product.id === productId);
    if (productToDelete.addedBy !== currentAdmin) {
      Swal.fire('Error', 'You can only delete products that you added.', 'error');
      return;
    }
    const updatedProducts = products.filter(
      (product) => product.id !== productId
    );
    setProducts(updatedProducts);
    Swal.fire('Success', 'Product deleted successfully!', 'success');
  };

  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  const filteredProducts = viewMyProducts
    ? products.filter((product) => product.addedBy === currentAdmin)
    : products;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        {editingProduct ? "Edit Product" : "Add New Product"}
      </h2>
      <form
        onSubmit={handleAddProduct}
        className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto"
        ref={formRef}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={imageInputRef}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-80 object-cover rounded-lg shadow-md"
              />
            )}
          </div>

          {/* Form Section */}
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="model"
              placeholder="Model"
              value={formData.model}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="number"
              name="pricePerHour"
              placeholder="Price Per Hour"
              value={formData.pricePerHour}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="number"
              name="pricePerDay"
              placeholder="Price Per Day"
              value={formData.pricePerDay}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="number"
              name="pricePerMonth"
              placeholder="Price Per Month"
              value={formData.pricePerMonth}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : editingProduct ? (
                "Update Product"
              ) : (
                "Add Product"
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Available Products Section */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Available Products</h2>
          <button
            onClick={() => setViewMyProducts(!viewMyProducts)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center space-x-2"
          >
            {viewMyProducts ? <FaEyeSlash /> : <FaEye />}
            <span>
              {viewMyProducts ? "View All Products" : "View My Products"}
            </span>
          </button>
        </div>
        {Object.keys(groupedProducts).map((category) => (
          <div key={category} className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">{category}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {groupedProducts[category]
                .filter((product) => filteredProducts.includes(product))
                .map((product) => (
                  <div
                    key={product.id}
                    id={`product-${product.id}`}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <img
                      src={
                        product.image.startsWith("data:image")
                          ? product.image
                          : `${process.env.PUBLIC_URL}/${product.image}`
                      }
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {product.description}
                    </p>
                    <p className="text-lg font-bold text-blue-600">
                      ${product.pricePerDay} per day
                    </p>
                    <p className="text-xs text-gray-500">{product.category}</p>
                    {product.addedBy === currentAdmin && (
                      <div className="flex justify-between mt-4">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition duration-300 flex items-center space-x-2"
                        >
                          <FaEdit />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300 flex items-center space-x-2"
                        >
                          <FaTrash />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;