"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signin: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/auth/signin", {
        email: formData.username,
        password: formData.password,
      });

      alert(res.data.message || "Signin successful.");
      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Error signing in"
      );
    }
  };

  const handleCreateAccountClick = () => navigate("/signup");

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background:"linear-gradient(to bottom right, #091053 100%, #001BFF 100%" }}
    >
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          {/* Left side */}
          <div className="lg:w-1/2 p-8 flex flex-col justify-center bg-gray-50">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">WELCOME!</h1>
            <p className="text-slate-600">Sign in to your EnergyMonitor account</p>
          </div>

          {/* Right side */}
          <div className="lg:w-1/2 p-8 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">SIGN IN</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="text-center text-red-500 text-sm mb-2">{error}</div>
              )}

              <div>
                <label htmlFor="username" className="block text-sm text-gray-500 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm text-gray-500 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                className="w-full text-white font-semibold py-3 px-4 rounded-lg"
                style={{ backgroundColor: "#091053" }}
              >
                SIGN IN
              </button>

              <div className="text-center text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                  onClick={handleCreateAccountClick}
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;

