import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("Customer");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Input states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSigninClick = () => navigate("/signin");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }
    if (!termsAccepted) {
      return setError("You must accept the terms and conditions.");
    }

    try {
      const res = await axios.post("http://localhost:5000/auth/signup", {
        fullName,
        email,
        phoneNumber,
        companyName,
        role,
        password,
        termsAccepted,
      });

      alert(res.data.message || "User created successfully.");
      navigate("/signin");
    } catch (error: any) {
      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Error signing up."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#030617] to-[#000845]">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-5xl flex p-10">
        {/* Left Section */}
        <div className="w-1/2 flex flex-col justify-center pr-10">
          <h1 className="text-3xl font-bold text-[#030675] mb-2">Hello!</h1>
          <p className="text-sm text-gray-600">
            Enter your personal details and start your journey with us
          </p>
        </div>

        {/* Right Section */}
        <div className="w-1/2">
          <h2 className="text-lg font-bold text-black mb-6 text-center">SIGN UP</h2>
          <form className="flex flex-col space-y-4" onSubmit={handleSignup}>
            {error && (
              <p className="text-center text-red-500 text-sm mb-2">{error}</p>
            )}
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
            <input
              type="text"
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              required
            />

            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Role</span>
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  value="Customer"
                  checked={role === "Customer"}
                  onChange={() => setRole("Customer")}
                />
                <span className="text-sm text-gray-700">Customer</span>
              </label>
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  value="Support Agent"
                  checked={role === "Support Agent"}
                  onChange={() => setRole("Support Agent")}
                />
                <span className="text-sm text-gray-700">Support Agent</span>
              </label>
            </div>

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              required
            />

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
              />
              <label htmlFor="terms" className="text-xs text-gray-600">
                I accept the Terms & Conditions
              </label>
            </div>

            <button
              type="submit"
              className="bg-[#030675] text-white py-2 rounded-md font-semibold hover:bg-[#020560] transition"
            >
              Create Account
            </button>

            <p className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                className="text-[#030675] font-semibold hover:underline"
                onClick={handleSigninClick}
              >
                SIGN IN
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;


