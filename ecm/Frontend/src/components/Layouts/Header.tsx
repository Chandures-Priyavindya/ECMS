"use client";

import { useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChevronDown, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const tokenExpiry = localStorage.getItem("tokenExpiry");

        if (!token || !tokenExpiry) {
          setLoading(false);
          return navigate("/signin");
        }

        const expiryDate = new Date(tokenExpiry);
        if (expiryDate < new Date()) {
          localStorage.removeItem("token");
          localStorage.removeItem("tokenExpiry");
          setLoading(false);
          return navigate("/signin");
        }

        const res = await axios.get("/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFirstName(res.data.firstName || "User");
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setLoading(false);
        navigate("/signin");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    navigate("/signin");
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <header className="h-20 w-full bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm relative z-10">
      {/* Left Section */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>

      {/* Right Section (User Menu) */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition text-gray-800"
            aria-label="User menu"
          >
            <User className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium">{firstName}</span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="z-50 mt-1 w-44 rounded-md border border-gray-200 bg-white p-1 shadow-lg"
        >
          <DropdownMenuItem
            onClick={handleSignOut}
            className="cursor-pointer text-center justify-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"

          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}



