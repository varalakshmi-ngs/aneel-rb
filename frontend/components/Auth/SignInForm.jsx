"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FiUser, FiLock, FiAlertCircle, FiEye, FiEyeOff } from "react-icons/fi";
import { getApiBase } from "@/utils/apiBase";
import { adminLogin } from "@/utils/adminApi";

export default function SignInForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.identifier || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const isMobile = /^\d{10}$/.test(formData.identifier);

      if (isMobile) {
        // Attempt Member Login
        const res = await fetch(`${getApiBase()}/members/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile_number: formData.identifier, password: formData.password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Member login failed");

        localStorage.setItem("member_token", data.token);
        localStorage.setItem("member_info", JSON.stringify(data.user));
        router.push("/Members/" + data.user.id);
      } else {
        // Attempt Admin Login
        const data = await adminLogin(formData.identifier, formData.password);
        if (data.token) {
          localStorage.setItem("adminToken", data.token);
          router.push("/admin/dashboard");
        } else {
          throw new Error("Admin login failed: No token received");
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-500 font-medium">Sign in to your account</p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-medium"
        >
          <FiAlertCircle className="flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Mobile or Username</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiUser className="text-gray-400" />
            </div>
            <input
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="10-digit number or admin"
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiLock className="text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl pl-12 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-emerald-500 transition-colors"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-sm rounded-2xl shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 transition-all mt-4 active:scale-[0.98]"
        >
          {loading ? "Verifying..." : "Secure Sign In"}
        </button>
      </form>
    </div>

  );
}
