import React, { useEffect, useState } from "react";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [preview, setPreview] = useState(null);

 useEffect(() => {
  const storedUser = localStorage.getItem("user");

  if (storedUser && storedUser !== "undefined") {
    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setPreview(parsedUser.picture);
    } catch (err) {
      console.error("Invalid user in localStorage", err);
    }
  }
}, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setPreview(imageURL);
    }
  };

  if (!user) {
    return (
      <div className="p-6 text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 relative overflow-hidden">

      {/* Background blobs (same as dashboard) */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-300/20 blur-[100px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-300/20 blur-[100px] rounded-full" />

      <div className="relative z-10 max-w-5xl mx-auto p-4 md:p-8">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
            Profile Settings
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your personal information
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {/* LEFT CARD */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm p-6 flex flex-col items-center hover:shadow-xl transition">

            <div className="relative">
              <img
                src={preview || "https://via.placeholder.com/100"}
                alt="profile"
                className="w-28 h-28 rounded-full object-cover border"
              />

              <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer text-xs shadow">
                ✏️
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-800">
              {user.name || "User"}
            </h2>

            <p className="text-gray-500 text-sm">
              {user.email}
            </p>
          </div>

          {/* RIGHT CARD */}
          <div className="md:col-span-2 bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm p-6 hover:shadow-xl transition">

            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Personal Information
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              <div>
                <label className="text-sm text-gray-500">Full Name</label>
                <input
                  value={user.name || ""}
                  readOnly
                  className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-300 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">Email</label>
                <input
                  value={user.email || ""}
                  readOnly
                  className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-300 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">Role</label>
                <input
                  placeholder="Frontend Developer"
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">Experience</label>
                <input
                  placeholder="Fresher"
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300 outline-none"
                />
              </div>

            </div>

            {/* SAVE BUTTON */}
            <div className="mt-6 flex justify-end">
              <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:scale-105 transition">
                Save Changes
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;