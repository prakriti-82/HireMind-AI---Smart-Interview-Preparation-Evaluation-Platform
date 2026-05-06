import React, { useEffect, useState } from "react";

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    experience: "",
  });

  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

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

      setPreview(parsedUser.picture);
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    setSaving(true);

    const updatedUser = {
      ...user,
      picture: preview,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    setTimeout(() => setSaving(false), 800);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 relative overflow-hidden">

      {/* background glow */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-300/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-300/20 blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">

        {/* HEADER */}
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
          <div className="bg-white/70 backdrop-blur-xl shadow-lg rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-xl transition">

            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-3xl font-bold text-white overflow-hidden">
                {preview ? (
                  <img
                    src={preview}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user.name?.charAt(0)?.toUpperCase()
                )}
              </div>

              <label className="absolute bottom-0 right-0 bg-white text-blue-600 p-2 rounded-full cursor-pointer shadow-md text-xs">
                ✏️
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              {user.name || "User"}
            </h3>

            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>

          {/* RIGHT CARD */}
          <div className="md:col-span-2 bg-white/70 backdrop-blur-xl shadow-lg rounded-2xl p-6 hover:shadow-xl transition">

            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Personal Information
            </h3>

            <div className="grid md:grid-cols-2 gap-4">

              <input
                value={user.name}
                onChange={(e) =>
                  setUser({ ...user, name: e.target.value })
                }
                placeholder="Full Name"
                className="w-full p-3 rounded-xl border bg-white focus:ring-2 focus:ring-blue-400"
              />

              <input
                value={user.email}
                readOnly
                className="w-full p-3 rounded-xl border bg-gray-100 text-gray-500"
              />

              <input
                value={user.role}
                onChange={(e) =>
                  setUser({ ...user, role: e.target.value })
                }
                placeholder="Role (Frontend Developer)"
                className="w-full p-3 rounded-xl border bg-white focus:ring-2 focus:ring-blue-400"
              />

              <input
                value={user.experience}
                onChange={(e) =>
                  setUser({ ...user, experience: e.target.value })
                }
                placeholder="Experience (Fresher / 2 yrs)"
                className="w-full p-3 rounded-xl border bg-white focus:ring-2 focus:ring-blue-400"
              />

            </div>

            {/* SAVE BUTTON */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-md hover:scale-105 transition"
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