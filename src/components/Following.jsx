import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "./Loader";
import Toast from "./Toast";
import ProfileImageViewer from "./ProfileImageViewer";

const API_URL = "https://blog-api-bovz.onrender.com";

function Following() {
  const { id } = useParams();

  const [author, setAuthor] = useState(null);
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
        const authorResponse = await fetch(`${API_URL}/api/users/${id}`);
        const authorData = await authorResponse.json();

        if (!authorResponse.ok) {
          setToast({
            type: "error",
            message: authorData.message || "Failed to load user",
          });

          setLoading(false);
          return;
        }

        setAuthor(authorData);

        const followingResponse = await fetch(
          `${API_URL}/api/users/${id}/following`,
        );

        const followingData = await followingResponse.json();

        if (!followingResponse.ok) {
          setToast({
            type: "error",
            message: followingData.message || "Failed to load following",
          });

          setLoading(false);
          return;
        }

        setFollowing(followingData);
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
        ← Back to Profile
      </Link>

      <div className="mt-8 bg-gray-100 rounded-2xl p-4 md:p-6">
        <div className="bg-white rounded-2xl p-5 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <ProfileImageViewer
              src={getImageUrl(author?.profilePicture)}
              alt={author?.username || "User"}
              size="w-24 h-24"
            />

            <div>
              <p className="text-purple-600 font-semibold mb-1">
                BlogEra Profile Network
              </p>

              <h1 className="text-3xl md:text-4xl font-[JetBrains] font-bold">
                {author?.username || "User"} is Following
              </h1>

              <p className="text-gray-600 mt-2 leading-7">
                These are the people{" "}
                <span className="font-semibold text-gray-800">
                  {author?.username || "this user"}
                </span>{" "}
                follows on BlogEra.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <div className="bg-purple-50 text-purple-700 px-4 py-2 rounded-xl font-semibold">
                  {following.length} Following
                </div>

                <div className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-semibold">
                  Followers:{" "}
                  {author?.followersCount || author?.followers?.length || 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        {following.length === 0 ? (
          <div className="bg-gray-100 rounded-2xl p-6 text-center">
            <div className="bg-white rounded-xl p-8 border-2 border-dashed border-gray-300">
              <h2 className="text-2xl font-bold">Not following anyone yet</h2>

              <p className="text-gray-500 mt-2">
                {author?.username || "This user"} is not following anyone yet.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 rounded-2xl p-4 md:p-6">
            <h2 className="text-2xl font-bold mb-5">All Following</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {following.map((user) => (
                <div
                  key={user._id}
                  className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition"
                >
                  <div className="flex items-start gap-4">
                    <ProfileImageViewer
                      src={getImageUrl(user.profilePicture)}
                      alt={user.username || "User"}
                      size="w-16 h-16"
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold break-words">
                        {user.username || "Unknown user"}
                      </h3>

                      <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                        {user.bio || "No bio added yet."}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2 text-sm">
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                          Followers: {user.followers?.length || 0}
                        </span>

                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                          Following: {user.following?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/dashboard/author/${user._id}`}
                    className="block mt-5 text-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-semibold"
                  >
                    View Profile
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Following;
