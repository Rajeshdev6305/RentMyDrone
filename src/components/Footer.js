import React from "react";
import {
  FaInfoCircle,
  FaServicestack,
  FaEnvelope,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-200 py-12">
      <div className="container mx-auto px-4 md:px-6">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About the Company */}
          <div id="about-us" className="space-y-4">
            <h4 className="font-semibold text-xl flex items-center space-x-2">
              <FaInfoCircle className="text-blue-400" />
              <span>About Us</span>
            </h4>
            <p className="text-sm leading-relaxed">
              We provide top-tier drone rental services for events, food delivery, and farming. Our advanced fleet ensures fast, safe, and eco-friendly solutions tailored to your needs.
            </p>
          </div>

          {/* Services */}
          <div id="services" className="space-y-4">
            <h4 className="font-semibold text-xl flex items-center space-x-2">
              <FaServicestack className="text-blue-400" />
              <span>Our Services</span>
            </h4>
            <ul className="list-none space-y-2 text-sm">
              <li className="hover:text-blue-400 transition-colors duration-200">
                <a href="/services/drone-delivery">Drone Delivery</a>
              </li>
              <li className="hover:text-blue-400 transition-colors duration-200">
                <a href="/services/tracking">Real-Time Tracking</a>
              </li>
              <li className="hover:text-blue-400 transition-colors duration-200">
                <a href="/services/rentals">Drone Rentals</a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div id="contact-us" className="space-y-4">
            <h4 className="font-semibold text-xl flex items-center space-x-2">
              <FaEnvelope className="text-blue-400" />
              <span>Contact Us</span>
            </h4>
            <p className="text-sm">
              <a href="mailto:support@dronecompany.com" className="hover:text-blue-400 transition-colors duration-200">
                support@dronecompany.com
              </a>
            </p>
            <p className="text-sm">
              <a href="tel:+919876543210" className="hover:text-blue-400 transition-colors duration-200">
                +91 98765 43210
              </a>
            </p>
            <p className="text-sm">Ameerpet, Hyderabad, Telangana, India</p>
          </div>

          {/* Newsletter Signup */}
          <div id="newsletter" className="space-y-4">
            <h4 className="font-semibold text-xl">Stay Updated</h4>
            <p className="text-sm">Subscribe to our newsletter for the latest updates and offers.</p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your Email"
                className="p-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <button
                type="submit"
                className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-10 flex justify-center space-x-6">
          <a
            href="https://www.facebook.com/dronecompany"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-500 transition-colors duration-300"
          >
            <FaFacebookF size={20} />
          </a>
          <a
            href="https://www.twitter.com/dronecompany"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
          >
            <FaTwitter size={20} />
          </a>
          <a
            href="https://www.instagram.com/dronecompany"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-pink-500 transition-colors duration-300"
          >
            <FaInstagram size={20} />
          </a>
          <a
            href="https://www.linkedin.com/company/dronecompany"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-600 transition-colors duration-300"
          >
            <FaLinkedinIn size={20} />
          </a>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Drone Delivery Service. All rights reserved.</p>
          <div className="space-x-4 mt-4 md:mt-0">
            <a href="/privacy-policy" className="hover:text-blue-400 transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="hover:text-blue-400 transition-colors duration-200">
              Terms of Service
            </a>
            <a href="/faq" className="hover:text-blue-400 transition-colors duration-200">
              FAQ
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;