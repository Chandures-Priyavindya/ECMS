import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('Customer');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSigninClick = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#030617] to-[#000845]">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-5xl flex p-10">
        {/* Left Section */}
        <div className="w-1/2 flex flex-col justify-center pr-10">
          <h1 className="text-3xl font-bold text-[#030675] mb-2">Hello!</h1>
          <p className="text-sm text-gray-600">
            Enter your personal details and start journey with us
          </p>
        </div>

        {/* Right Section */}
        <div className="w-1/2">
          <h2 className="text-lg font-bold text-black mb-6 text-center">SIGN UP</h2>
          <form className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#030675]"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#030675]"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#030675]"
            />
            <input
              type="text"
              placeholder="Company Name"
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#030675]"
            />

            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Role</span>
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="role"
                  value="Customer"
                  checked={role === 'Customer'}
                  onChange={() => setRole('Customer')}
                  className="accent-[#030675]"
                />
                <span className="text-sm text-gray-700">Customer</span>
              </label>
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="role"
                  value="Support Agent"
                  checked={role === 'Support Agent'}
                  onChange={() => setRole('Support Agent')}
                  className="accent-[#030675]"
                />
                <span className="text-sm text-gray-700">Support Agent</span>
              </label>
            </div>

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#030675]"
            />
            <input
              type="password"
              placeholder="Re-enter Password"
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#030675]"
            />

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
                className="accent-[#030675]"
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
              Already have an account?{' '}
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
