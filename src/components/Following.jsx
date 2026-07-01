import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "./Loader";
import Toast from "./Toast";
import ProfileImageViewer from "./ProfileImageViewer";

const API_URL = "https://blog-api-bovz.onrender.com";

function Following() {
  const { id } = useParams();

  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    async function getFollowing() {
      try {
        const response = await fetch(`${API_URL}/api/users/${id}/following`);

        const data = await response.json();

        if (!response.ok) {
          setToast({
            type: "error",
            message: data.message || "Failed to load following",
          });

          setLoading(false);
          return;
        }

        setFollowing(data);
        setLoading(false);
      } catch (error) {
        setToast({
          type: "error",
          message: "Something went wrong while loading following",
        });

        setLoading(false);
      }
    }

    getFollowing();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-4 md:p-8 min-h-screen w-full">
      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ type: "", message: "" })}
      />

      <Link
        to={`/dashboard/author/${id}`}
        className="text-purple-600 hover:underline font-semibold"
      >
        ← Back to Author Profile
      </Link>

      <h1 className="text-3xl md:text-4xl font-[JetBrains] font-bold mt-6 mb-3">
        Following
      </h1>

      <p className="text-gray-600 mb-8">
        People this BlogEra user is following.
      </p>

      {following.length === 0 ? (
        <div className="bg-gray-100 rounded-2xl p-6 text-center">
          <h2 className="text-2xl font-bold">Not following anyone yet</h2>
          <p className="text-gray-500 mt-2">
            This user is not following anyone yet.
          </p>
        </div>
      ) : (
        <div className="bg-gray-100 rounded-2xl p-4 md:p-6 space-y-4">
          {following.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <ProfileImageViewer
                  src={getImageUrl(user.profilePicture)}
                  alt={user.username || "User"}
                  size="w-14 h-14"
                />

                <div>
                  <h2 className="text-xl font-bold">
                    {user.username || "Unknown user"}
                  </h2>

                  <p className="text-gray-500 text-sm line-clamp-1">
                    {user.bio || "No bio added yet."}
                  </p>
                </div>
              </div>

              <Link
                to={`/dashboard/author/${user._id}`}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-center"
              >
                View Profile
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Following;
