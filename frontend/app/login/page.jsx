"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SignInForm from "@/components/Auth/SignInForm";
import SignUpForm from "@/components/Auth/SignUpForm";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function AuthPortal() {
  const [activeTab, setActiveTab] = useState("signin"); // "signin" | "signup"

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col relative font-sans text-neutral-200">
      
      {/* Decorative Header */}
      <div className="absolute top-0 left-0 right-0 h-[40vh] bg-gradient-to-br from-emerald-600/20 via-emerald-800/10 to-neutral-900 z-0 border-b border-emerald-500/10"></div>
      
      {/* Navbar area */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
          <FiArrowLeft /> Back to Home
        </Link>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-10 px-4 sm:px-6 w-full max-w-4xl mx-auto">
        
        {/* Tab Switcher */}
        <div className="bg-neutral-800/80 backdrop-blur-sm p-1.5 rounded-full flex mb-8 border border-neutral-700 w-full max-w-md mx-auto shadow-xl">
          <button
            type="button"
            onClick={() => setActiveTab("signin")}
            className={`flex-1 py-3 px-4 text-sm font-semibold rounded-full flex justify-center items-center transition-all duration-300 ${
              activeTab === "signin"
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/50"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-3 px-4 text-sm font-semibold rounded-full flex justify-center items-center transition-all duration-300 ${
              activeTab === "signup"
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/50"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Content Container */}
        <div className="w-full bg-neutral-800 rounded-2xl shadow-2xl border border-neutral-700 relative overflow-hidden transition-all duration-500">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
          
          <div className="p-6 md:p-10 w-full">
            <AnimatePresence mode="wait">
              {activeTab === "signin" && (
                <motion.div
                  key="signin"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-md mx-auto"
                >
                  <SignInForm />
                </motion.div>
              )}

              {activeTab === "signup" && (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SignUpForm />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
