"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import DashboardSidebar from "../Layouts/Dashboardsidebar";
import Header from "../Layouts/Header";

const Settings: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("User data received:", res.data);

        const userData = res.data;

        if (!userData) {
          throw new Error("User data not found in response");
        }

        setUser(userData);
        setFormData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          phoneNumber: userData.phoneNumber || "",
        });

        console.log("Setting formData:", userData);
      } catch (err) {
        console.error("Failed to load user profile", err);
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.firstName || !formData.lastName || !formData.phoneNumber) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const res = await axios.put("/api/user", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
      setEditMode(false);
      alert("Changes saved successfully.");
    } catch (err) {
      console.error("Failed to save changes", err);
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading settings...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="flex w-full bg-gray-50 overflow-hidden">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden p-4 space-y-4">
        <Header
          title="User Settings"
          subtitle="Manage your profile and account preferences"
        />

        <main className="flex-1 overflow-y-auto px-6 py-8 bg-white">
          <div className="max-w-4xl mx-auto space-y-10">
            {/* Profile Overview */}
            <section className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-semibold">
                {formData.firstName?.[0] ?? ""}
                {formData.lastName?.[0] ?? ""}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {formData.firstName || "First"} {formData.lastName || "Last"}
                </h2>
              </div>
            </section>

            {/* Profile Form */}
            <section className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-1">
                Profile Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    disabled={!editMode}
                    onChange={handleChange}
                    className="w-full mt-1 px-4 py-2 border rounded-md bg-gray-50"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    disabled={!editMode}
                    onChange={handleChange}
                    className="w-full mt-1 px-4 py-2 border rounded-md bg-gray-50"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full mt-1 px-4 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    disabled={!editMode}
                    onChange={handleChange}
                    className="w-full mt-1 px-4 py-2 border rounded-md bg-gray-50"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setEditMode(!editMode)}
                  className="px-4 py-2 border rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200"
                >
                  {editMode ? "Cancel" : "Edit"}
                </button>
                {editMode && (
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`px-5 py-2 rounded-md text-white ${
                      saving
                        ? "bg-[#091053] cursor-not-allowed"
                        : "bg-[#091053]"
                    }`}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                )}
              </div>
            </section>

            {/* Password Section */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-4">
                Security
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Want to reset your password?</p>
                <button className="text-sm text-blue-600 hover:underline">
                  Request password reset
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;

