import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import Loader from "./Loader";
import Toast from "./Toast";
import ProfileImageViewer from "./ProfileImageViewer";

const API_URL = "https://blog-api-bovz.onrender.com";

function FindWriters() {
  const currentUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [query, setQuery] = useState("");
  const [writers, setWriters] = useState([]);
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    type: "",
    message: "",
  });

  function getImageUrl(image) {
    if (!image) {
      return "";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `${API_URL}${image}`;
  }

  async function getWriters(searchText = "") {
    if (!token) {
      setToast({
        type: "error",
        message: "Please login to search writers",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/users/search?query=${encodeURIComponent(searchText)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setToast({
          type: "error",
          message: data.message || "Failed to load writers",
        });

        setLoading(false);
        return;
      }

      setWriters(data);
      setLoading(false);
    } catch (error) {
      setToast({
        type: "error",
        message: "Something went wrong while loading writers",
      });

      setLoading(false);
    }
  }

  useEffect(() => {
    getWriters("");
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      getWriters(query);
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [query]);

  async function handleFollow(userId) {
    if (!token) {
      setToast({
        type: "error",
        message: "Please login to follow this writer",
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users/${userId}/follow`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setToast({
          type: "error",
          message: data.message || "Failed to follow writer",
        });
        return;
      }

      setWriters((prevWriters) =>
        prevWriters.map((writer) => {
          if (writer._id !== userId) {
            return writer;
          }

          return {
            ...writer,
            followers: data.followers || writer.followers || [],
            following: data.following || writer.following || [],
          };
        }),
      );

      setToast({
        type: "success",
        message: data.message || "Follow updated",
      });
    } catch (error) {
      setToast({
        type: "error",
        message: "Something went wrong while following writer",
      });
    }
  }

  return (
    <div>
      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ type: "", message: "" })}
      />

      <div className="bg-gray-100 rounded-2xl p-4 md:p-6">
        <div className="bg-white rounded-2xl p-5 md:p-6">
          <h2 className="text-2xl md:text-3xl font-[JetBrains] font-bold">
            Find Writers
          </h2>

          <p className="text-gray-600 mt-2">
            Search for BlogEra writers, follow them, and view their profiles.
          </p>

          <div className="relative mt-6">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search writers by username or email..."
              className="w-full bg-gray-100 rounded-full pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        {loading ? (
          <Loader />
        ) : writers.length === 0 ? (
          <div className="bg-gray-100 rounded-2xl p-6 text-center">
            <div className="bg-white rounded-xl p-8 border-2 border-dashed border-gray-300">
              <h2 className="text-2xl font-bold">No writers found</h2>

              <p className="text-gray-500 mt-2">
                Try searching another username or email.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 rounded-2xl p-4 md:p-6">
            <h2 className="text-2xl font-bold mb-5">Writers on BlogEra</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {writers.map((writer) => {
                const isFollowing = writer.followers?.some(
                  (followerId) =>
                    followerId === currentUserId ||
                    followerId?._id === currentUserId,
                );

                return (
                  <div
                    key={writer._id}
                    className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition"
                  >
                    <div className="flex items-start gap-4">
                      <ProfileImageViewer
                        src={getImageUrl(writer.profilePicture)}
                        alt={writer.username || "Writer"}
                        size="w-16 h-16"
                      />

                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold break-words">
                          {writer.username || "Unknown writer"}
                        </h3>

                        <p className="text-purple-600 text-sm break-words">
                          {writer.email || "No email"}
                        </p>

                        <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                          {writer.bio || "No bio added yet."}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2 text-sm">
                          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                            Followers: {writer.followers?.length || 0}
                          </span>

                          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                            Following: {writer.following?.length || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col sm:flex-row gap-3">
                      <Link
                        to={`/dashboard/author/${writer._id}`}
                        className="flex-1 text-center border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-4 py-2 rounded-xl font-semibold"
                      >
                        View Profile
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleFollow(writer._id)}
                        className={`flex-1 px-4 py-2 rounded-xl font-semibold ${
                          isFollowing
                            ? "bg-gray-900 text-white hover:bg-black"
                            : "bg-purple-600 text-white hover:bg-purple-700"
                        }`}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FindWriters;
