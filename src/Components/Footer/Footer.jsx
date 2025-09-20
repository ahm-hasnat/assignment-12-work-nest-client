import React from "react";
import Logo from "../Shared/logo";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
  FaApple,
  FaWindows,
  FaAndroid,
} from "react-icons/fa";
import { SiIos } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="bg-[#2f3834] text-gray-300 py-8 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Section */}
        <aside className="flex flex-col items-center md:items-start text-center
         md:text-left">
          <div className="flex items-end gap-2">
            <Logo />
            <h1 className="text-xl font-bold -ml-5 text-white">WorkNest</h1>
          </div>
          <p className="text-sm mt-2">Providing reliable service since 1992</p>
        </aside>

        {/* Apps Section with Icons */}
        <nav className="flex flex-col items-center md:items-start text-sm">
          <h6 className="text-base font-semibold mb-2 text-white">Apps</h6>
          <a className="flex items-center gap-2 hover:text-[#29d409] transition">
            <FaApple /> Mac
          </a>
          <a className="flex items-center gap-2 hover:text-[#29d409] transition">
            <FaWindows /> Windows
          </a>
          <a className="flex items-center gap-2 hover:text-[#29d409] transition">
            <SiIos /> iPhone
          </a>
          <a className="flex items-center gap-2 hover:text-[#29d409] transition">
            <FaAndroid /> Android
          </a>
        </nav>

        {/* Legal Section */}
        <nav className="flex flex-col items-center md:items-start text-sm">
          <h6 className="text-base font-semibold mb-2 text-white">Legal</h6>
          <a className="hover:text-[#29d409] transition">Terms of Use</a>
          <a className="hover:text-[#29d409] transition">Privacy Policy</a>
          <a className="hover:text-[#29d409] transition">Cookie Policy</a>
        </nav>

        {/* Social Section */}
        <nav className="flex flex-col items-center md:items-start">
          <h6 className="text-base font-semibold mb-2 text-white">Follow Us</h6>
          <div className="flex gap-4 text-lg">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#29d409] transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#29d409] transition"
            >
              <FaTwitter />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#29d409] transition"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#29d409] transition"
            >
              <FaYoutube />
            </a>
          </div>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="mt-6 border-t border-gray-600 pt-4 text-center text-xs
       text-gray-400">
        <p>© {new Date().getFullYear()} WorkNest Ltd. — All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
