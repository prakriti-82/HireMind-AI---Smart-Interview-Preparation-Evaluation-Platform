import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    experience: "",
  });

  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  // ==============================
  // LOAD USER
  // ==============================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser && storedUser !== "undefined") {
      const parsedUser = JSON.parse(storedUser);

      setUser({
        name: parsedUser.name || "",
        email: parsedUser.email || "",
        role: parsedUser.role || "",
        experience: parsedUser.experience || "",
      });

      setPreview(parsedUser.picture || null);
    }
  }, []);

  // ==============================
  // IMAGE UPLOAD
  // ==============================
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreview(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  // ==============================
  // SAVE PROFILE (FIXED)
  // ==============================
  const handleSave = async () => {
    try {
      setSaving(true);

      const response = await axiosInstance.put(
        "/auth/update-profile",
        {
          ...user,
          picture: preview,
        }
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      setSaving(false);
      alert("Profile updated successfully!");

    } catch (error) {
      console.log(error);
      setSaving(false);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 relative overflow-hidden">

      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-300/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-300/20 blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Profile Settings
          </h2>
          <p className="text-gray-500 mt-1">
            Manage your personal information
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {/* LEFT CARD */}
          <div className="bg-white/70 backdrop-blur-xl shadow-lg rounded-2xl p-6 flex flex-col items-center text-center">

            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-3xl font-bold text-white overflow-hidden">

                {preview ? (
                  <img
                    src={preview}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user.name?.charAt(0)?.toUpperCase()
                )}

              </div>

              <label className="absolute bottom-0 right-0 bg-white text-blue-600 p-2 rounded-full cursor-pointer text-xs">
                ✏️
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              {user.name || "User"}
            </h3>

            <p className="text-gray-500 text-sm">
              {user.email}
            </p>

          </div>

          {/* RIGHT CARD */}
          <div className="md:col-span-2 bg-white/70 backdrop-blur-xl shadow-lg rounded-2xl p-6">

            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Personal Information
            </h3>

            <div className="grid md:grid-cols-2 gap-4">

              <input
                value={user.name}
                onChange={(e) =>
                  setUser({ ...user, name: e.target.value })
                }
                className="p-3 border rounded-xl"
                placeholder="Name"
              />

              <input
                value={user.email}
                readOnly
                className="p-3 border rounded-xl bg-gray-100"
              />

              <input
                value={user.role}
                onChange={(e) =>
                  setUser({ ...user, role: e.target.value })
                }
                className="p-3 border rounded-xl"
                placeholder="Role"
              />

              <input
                value={user.experience}
                onChange={(e) =>
                  setUser({ ...user, experience: e.target.value })
                }
                className="p-3 border rounded-xl"
                placeholder="Experience"
              />

            </div>

            <div className="mt-6 flex justify-end">

              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-500 text-white rounded-xl"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;