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

    const storedUser =
      localStorage.getItem("user");

    if (
      storedUser &&
      storedUser !== "undefined"
    ) {

      const parsedUser =
        JSON.parse(storedUser);

      setUser({
        name: parsedUser.name || "",
        email: parsedUser.email || "",
        role: parsedUser.role || "",
        experience:
          parsedUser.experience || "",
      });

      setPreview(
        parsedUser.picture || null
      );
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
  // SAVE PROFILE
  // ==============================
  const handleSave = async () => {

    try {

      setSaving(true);

      const response =
        await axiosInstance.put(
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

      alert(
        "Profile updated successfully!"
      );

    } catch (error) {

      console.log(error);

      setSaving(false);

      alert("Failed to update profile");
    }
  };

  return (

    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#dfe9ff] via-[#edf3ff] to-[#cfdcff]">

      {/* BACKGROUND BLOBS */}
      <div className="absolute top-[-120px] left-[-120px] w-[420px] h-[420px] bg-blue-400/20 blur-[120px] rounded-full" />

      <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] bg-indigo-400/20 blur-[120px] rounded-full" />

      <div className="absolute top-[40%] left-[40%] w-[250px] h-[250px] bg-sky-300/10 blur-[100px] rounded-full" />

      {/* MAIN */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">

       {/* HEADER */}
<div className="mb-10">

  <div className="w-full bg-white/35 backdrop-blur-2xl border border-white/30 shadow-[0_8px_40px_rgba(0,0,0,0.06)] rounded-[30px] p-7">

    {/* BADGE */}
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 backdrop-blur-xl border border-white/30 shadow-md mb-5">

      <span className="text-blue-600">
        ⚙️
      </span>

      <span className="text-sm font-semibold text-blue-700">

        Account Settings

      </span>

    </div>

    {/* HEADING */}
    <h1 className="text-4xl md:text-5xl font-black text-gray-800 leading-tight">

      Profile
      <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        {" "}Settings
      </span>

    </h1>

    {/* DESCRIPTION */}
    <p className="text-gray-600 text-lg mt-4 max-w-2xl leading-relaxed">

      Manage your personal information,
      profile details, and account preferences.

    </p>

  </div>

</div>

        {/* CONTENT */}
        <div className="grid md:grid-cols-3 gap-7">

          {/* LEFT CARD */}
          <div className="bg-white/35 backdrop-blur-2xl border border-white/30 shadow-2xl rounded-[30px] p-8 flex flex-col items-center text-center">

            {/* IMAGE */}
            <div className="relative">

              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-700 flex items-center justify-center text-4xl font-bold text-white overflow-hidden shadow-xl border-4 border-white/40">

                {preview ? (

                  <img
                    src={preview}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />

                ) : (

                  user.name
                    ?.charAt(0)
                    ?.toUpperCase()

                )}

              </div>

              {/* EDIT BUTTON */}
              <label className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition">

                ✏️

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handleImageChange
                  }
                  className="hidden"
                />

              </label>

            </div>

            {/* USER INFO */}
            <h3 className="mt-5 text-2xl font-bold text-gray-800">

              {user.name || "User"}

            </h3>

            <p className="text-gray-500 mt-1">

              {user.email}

            </p>

            {/* MINI STATS */}
            <div className="mt-7 w-full grid grid-cols-2 gap-3">

              <div className="bg-white/40 border border-white/30 rounded-2xl p-4">

                <h4 className="text-blue-600 text-sm font-medium">

                  Role

                </h4>

                <p className="text-gray-700 font-semibold mt-1 text-sm">

                  {user.role || "N/A"}

                </p>

              </div>

              <div className="bg-white/40 border border-white/30 rounded-2xl p-4">

                <h4 className="text-indigo-600 text-sm font-medium">

                  Experience

                </h4>

                <p className="text-gray-700 font-semibold mt-1 text-sm">

                  {user.experience || "N/A"}

                </p>

              </div>

            </div>

          </div>

          {/* RIGHT CARD */}
          <div className="md:col-span-2 bg-white/35 backdrop-blur-2xl border border-white/30 shadow-2xl rounded-[30px] p-8">

            <div className="flex items-center justify-between mb-7">

              <div>

                <h2 className="text-2xl font-bold text-gray-800">

                  Personal Information

                </h2>

                <p className="text-gray-500 mt-1">

                  Update your profile details

                </p>

              </div>

              <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg">

                👤

              </div>

            </div>

            {/* FORM */}
            <div className="grid md:grid-cols-2 gap-5">

              {/* NAME */}
              <div>

                <label className="text-sm font-medium text-gray-600 mb-2 block">

                  Full Name

                </label>

                <input
                  value={user.name}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-2xl bg-white/50 border border-white/40 outline-none focus:ring-2 focus:ring-blue-400 transition"
                  placeholder="Enter your name"
                />

              </div>

              {/* EMAIL */}
              <div>

                <label className="text-sm font-medium text-gray-600 mb-2 block">

                  Email Address

                </label>

                <input
                  value={user.email}
                  readOnly
                  className="w-full px-4 py-3 rounded-2xl bg-gray-100/80 border border-white/40 text-gray-500"
                />

              </div>

              {/* ROLE */}
              <div>

                <label className="text-sm font-medium text-gray-600 mb-2 block">

                  Job Role

                </label>

                <input
                  value={user.role}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      role: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-2xl bg-white/50 border border-white/40 outline-none focus:ring-2 focus:ring-blue-400 transition"
                  placeholder="Frontend Developer"
                />

              </div>

              {/* EXPERIENCE */}
              <div>

                <label className="text-sm font-medium text-gray-600 mb-2 block">

                  Experience

                </label>

                <input
                  value={user.experience}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      experience:
                        e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-2xl bg-white/50 border border-white/40 outline-none focus:ring-2 focus:ring-blue-400 transition"
                  placeholder="2 Years"
                />

              </div>

            </div>

            {/* SAVE BUTTON */}
            <div className="mt-10 flex justify-end">

              <button
                onClick={handleSave}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white font-semibold shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 disabled:opacity-50"
              >

                {saving
                  ? "Saving..."
                  : "Save Changes"}

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ProfilePage;