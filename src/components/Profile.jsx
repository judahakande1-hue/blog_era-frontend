import { useState } from "react";
import Toast from "./Toast";

function Profile() {
  const [username, setUsername] = useState(
    localStorage.getItem("username") || "",
  );

  const [email] = useState(localStorage.getItem("email") || "");

  const [bio, setBio] = useState(localStorage.getItem("bio") || "");

  const [profilePicture, setProfilePicture] = useState(
    localStorage.getItem("profilePicture") || "",
  );

  const [toast, setToast] = useState({
    type: "",
    message: "",
  });

  async function handleProfilePictureChange(e) {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("profilePicture", file);

    const response = await fetch(
      "https://blog-api-bovz.onrender.com/api/users/me/profile-picture",
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      setToast({
        type: "error",
        message: data.message || "Profile picture upload failed",
      });
      return;
    }

    const fullImageUrl = `https://blog-api-bovz.onrender.com${data.profilePicture}`;

    setProfilePicture(fullImageUrl);
    localStorage.setItem("profilePicture", fullImageUrl);

    setToast({
      type: "success",
      message: "Profile picture updated successfully",
    });
  }

  async function handleSaveProfile(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const response = await fetch("https://blog-api-bovz.onrender.com/api/users/me/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username,
        bio,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setToast({
        type: "error",
        message: data.message || "Failed to update profile",
      });
      return;
    }

    localStorage.setItem("username", data.username);
    localStorage.setItem("bio", data.bio);

    setToast({
      type: "success",
      message: "Profile updated successfully",
    });
  }

  return (
    <div className="p-4 md:p-8 min-h-screen w-full">
      <h1 className="text-3xl md:text-4xl font-[JetBrains] font-bold mb-4">
        Profile Settings
      </h1>

      <p className="text-gray-600">
        Manage your public BlogEra profile and account information.
      </p>

      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ type: "", message: "" })}
      />

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6">
        <div className="bg-gray-100 rounded-2xl p-4 md:p-6">
          <div className="bg-white rounded-2xl p-6 text-center">
            <div className="mx-auto w-28 h-28 rounded-full overflow-hidden bg-purple-600 text-white flex items-center justify-center text-4xl font-bold border-4 border-purple-500">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{username ? username.charAt(0).toUpperCase() : "U"}</span>
              )}
            </div>

            <label className="inline-block mt-4 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-full cursor-pointer font-semibold">
              Change Picture
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
              />
            </label>

            <h2 className="text-2xl font-bold mt-5">
              {username || "No username"}
            </h2>

            <p className="text-purple-600 mt-1 break-words">
              {email || "No email"}
            </p>

            <p className="text-gray-600 mt-5 leading-7 break-words">
              {bio || "No bio added yet."}
            </p>
          </div>
        </div>

        <div className="bg-gray-100 rounded-2xl p-4 md:p-6">
          <div className="bg-white rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-2">Edit Profile</h2>

            <p className="text-gray-500 mb-6">
              Update how your profile appears to other BlogEra readers.
            </p>

            <form onSubmit={handleSaveProfile}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>

              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-5 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>

              <input
                value={email}
                readOnly
                type="email"
                className="w-full border border-gray-300 bg-gray-100 text-gray-500 rounded-xl px-4 py-3 mb-5 outline-none cursor-not-allowed"
              />

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bio
              </label>

              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write a short bio about yourself..."
                rows="6"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 resize-none outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />

              <button
                type="submit"
                className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;