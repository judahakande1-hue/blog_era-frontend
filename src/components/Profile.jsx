import { useEffect, useState } from "react";
import Toast from "./Toast";
import ProfileImageViewer from "./ProfileImageViewer";
import ImageCropper from "./ImageCropper";
import Loader from "./Loader";

const API_URL = "https://blog-api-bovz.onrender.com";

function Profile() {
  const [imageToCrop, setImageToCrop] = useState("");

  const [username, setUsername] = useState(
    localStorage.getItem("username") || "",
  );

  const [email, setEmail] = useState(localStorage.getItem("email") || "");

  const [bio, setBio] = useState(localStorage.getItem("bio") || "");

  const [profilePicture, setProfilePicture] = useState(
    localStorage.getItem("profilePicture") || "",
  );

  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState({
    type: "",
    message: "",
  });

  function getImageUrl(image) {
    if (!image) {
      return "";
    }

    if (
      image.startsWith("http") ||
      image.startsWith("blob:") ||
      image.startsWith("data:")
    ) {
      return image;
    }

    return `${API_URL}${image}`;
  }

  useEffect(() => {
    async function getProfile() {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`${API_URL}/api/users/me/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setToast({
            type: "error",
            message: data.message || "Failed to load profile",
          });

          setLoading(false);
          return;
        }

        setUsername(data.username || "");
        setEmail(data.email || "");
        setBio(data.bio || "");
        setProfilePicture(data.profilePicture || "");

        setFollowersCount(data.followersCount || data.followers?.length || 0);
        setFollowingCount(data.followingCount || data.following?.length || 0);

        localStorage.setItem("username", data.username || "");
        localStorage.setItem("email", data.email || "");
        localStorage.setItem("bio", data.bio || "");
        localStorage.setItem("profilePicture", data.profilePicture || "");

        setLoading(false);
      } catch (error) {
        setToast({
          type: "error",
          message: "Something went wrong while loading profile",
        });

        setLoading(false);
      }
    }

    getProfile();
  }, []);

  function handleProfilePictureChange(e) {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setImageToCrop(previewUrl);

    e.target.value = "";
  }

  async function uploadCroppedProfilePicture(croppedFile) {
    const previewUrl = URL.createObjectURL(croppedFile);
    setProfilePicture(previewUrl);
    setImageToCrop("");

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("profilePicture", croppedFile);

    try {
      const response = await fetch(`${API_URL}/api/users/me/profile-picture`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setToast({
          type: "error",
          message: data.message || "Profile picture upload failed",
        });
        return;
      }

      if (data.profilePicture) {
        setProfilePicture(data.profilePicture);
        localStorage.setItem("profilePicture", data.profilePicture);
      }

      setToast({
        type: "success",
        message: "Profile picture updated successfully",
      });
    } catch (error) {
      setToast({
        type: "error",
        message: "Something went wrong while uploading image",
      });
    }
  }

  async function handleSaveProfile(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/api/users/me/profile`, {
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

      setUsername(data.username || "");
      setBio(data.bio || "");
      setProfilePicture(data.profilePicture || "");

      setFollowersCount(data.followersCount || data.followers?.length || 0);
      setFollowingCount(data.followingCount || data.following?.length || 0);

      localStorage.setItem("username", data.username || "");
      localStorage.setItem("bio", data.bio || "");
      localStorage.setItem("profilePicture", data.profilePicture || "");

      setToast({
        type: "success",
        message: "Profile updated successfully",
      });
    } catch (error) {
      setToast({
        type: "error",
        message: "Something went wrong while saving profile",
      });
    }
  }

  if (loading) {
    return <Loader />;
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

      {imageToCrop && (
        <ImageCropper
          image={imageToCrop}
          onCancel={() => setImageToCrop("")}
          onCropDone={uploadCroppedProfilePicture}
        />
      )}

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6">
        <div className="bg-gray-100 rounded-2xl p-4 md:p-6">
          <div className="bg-white rounded-2xl p-6 text-center">
            <div className="mx-auto flex justify-center">
              <ProfileImageViewer
                src={getImageUrl(profilePicture)}
                alt={username || "Profile"}
                size="w-28 h-28"
              />
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
            <p className="text-gray-600 mt-2 leading-7 break-words">
              {bio || "No bio added yet."}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="bg-gray-100 rounded-xl p-4">
                <p className="text-2xl font-bold text-gray-900">
                  {followersCount}
                </p>
                <p className="text-sm text-gray-500">Followers</p>
              </div>

              <div className="bg-gray-100 rounded-xl p-4">
                <p className="text-2xl font-bold text-gray-900">
                  {followingCount}
                </p>
                <p className="text-sm text-gray-500">Following</p>
              </div>
            </div>
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
