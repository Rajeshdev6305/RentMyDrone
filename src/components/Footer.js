import React from "react";
import { FaInfoCircle, FaServicestack, FaEnvelope, FaStar, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  // Function to prevent page reload on social media icon click
  const handleSocialMediaClick = (e) => {
    e.preventDefault();
  };

  return (
    <footer className="bg-gray-800 text-white p-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* About the Company */}
          <div id="about-us" className="text-sm md:text-base">
            <h4 className="font-bold text-lg mb-2 flex items-center space-x-2">
              <FaInfoCircle />
              <span>About Us</span>
            </h4>
            <p>
              We provide drones for rent, offering a wide range of high-quality drones for various purposes including marriage events, food delivery, and farming. Our service ensures timely and safe deliveries, with real-time tracking and customizable solutions to meet your specific needs.
            </p>
            <p>
              Our rental process is simple and straightforward. Choose your desired drone, select the rental duration, and provide your delivery address. We take care of the rest, ensuring your drone is delivered to your doorstep ready for use.
            </p>
          </div>
          {/* Services */}
          <div id="services" className="text-sm md:text-base">
            <h4 className="font-bold text-lg mb-2 flex items-center space-x-2">
              <FaServicestack />
              <span>Our Services</span>
            </h4>
            <ul className="list-none list-inside">
              <li>Drone Delivery: Fast and reliable delivery of packages, food, and other items using our advanced drone fleet.</li>
              <li>Real-Time Tracking: Monitor your drone's location and status in real-time through our user-friendly app.</li>
              <li>Customizable Solutions: Tailor our drone services to meet your specific needs, whether for events, agriculture, or logistics.</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div id="contact-us" className="text-sm md:text-base">
            <h4 className="font-bold text-lg mb-2 flex items-center space-x-2">
              <FaEnvelope />
              <span>Contact Us</span>
            </h4>
            <p>Email: support@dronecompany.com</p>
            <p>Phone: +1 (123) 456-7890</p>
            <p>Address: 123 Drone Street, City, Country</p>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-8 flex justify-center space-x-6">
          <a href="facebook.com" onClick={handleSocialMediaClick} className="text-blue-600 text-2xl hover:text-blue-800 transition-colors duration-300">
            <FaFacebook />
          </a>
          <a href="twitter.com" onClick={handleSocialMediaClick} className="text-blue-400 text-2xl hover:text-blue-500 transition-colors duration-300">
            <FaTwitter />
          </a>
          <a href="instagram.com" onClick={handleSocialMediaClick} className="text-pink-600 text-2xl hover:text-pink-700 transition-colors duration-300">
            <FaInstagram />
          </a>
          <a href="linkedin.com" onClick={handleSocialMediaClick} className="text-blue-700 text-2xl hover:text-blue-800 transition-colors duration-300">
            <FaLinkedin />
          </a>
        </div>

        {/* Example Reviews */}
        <div className="mt-8">
          <h4 className="font-bold text-lg mb-2 flex items-center space-x-2">
            <FaStar />
            <span>Customer Reviews</span>
          </h4>
          <div className="space-y-4">
            <div className="border p-4 rounded-lg">
              <p className="font-bold">John Doe</p>
              <p className="flex items-center">
                <FaStar className="text-yellow-500" />
                <FaStar className="text-yellow-500" />
                <FaStar className="text-yellow-500" />
                <FaStar className="text-yellow-500" />
                <FaStar className="text-gray-400" />
              </p>
              <p>"Great service! The drone was delivered on time and worked perfectly for our event."</p>
            </div>
            <div className="border p-4 rounded-lg">
              <p className="font-bold">Jane Smith</p>
              <p className="flex items-center">
                <FaStar className="text-yellow-500" />
                <FaStar className="text-yellow-500" />
                <FaStar className="text-yellow-500" />
                <FaStar className="text-yellow-500" />
                <FaStar className="text-yellow-500" />
              </p>
              <p>"Excellent customer support and high-quality drones. Highly recommend!"</p>
            </div>
            <div className="border p-4 rounded-lg">
              <p className="font-bold">Alice Johnson</p>
              <p className="flex items-center">
                <FaStar className="text-yellow-500" />
                <FaStar className="text-yellow-500" />
                <FaStar className="text-yellow-500" />
                <FaStar className="text-yellow-500" />
                <FaStar className="text-gray-400" />
              </p>
              <p>"The rental process was smooth and hassle-free. The drone performed exceptionally well."</p>
            </div>
          </div>
        </div>
        <div className="text-center mt-4 text-xs md:text-sm">
          &copy; {new Date().getFullYear()} Drone Delivery Service. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
