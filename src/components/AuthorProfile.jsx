import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "./Loader";
import ProfileImageViewer from "./ProfileImageViewer";

function AuthorProfile() {
  const { id } = useParams();

  const currentUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getAuthorProfile() {
      try {
        const userResponse = await fetch(
          `https://blog-api-bovz.onrender.com/api/users/${id}`,
        );

        const userData = await userResponse.json();

        if (!userResponse.ok) {
          alert(userData.message || "Failed to load author");
          setLoading(false);
          return;
        }

        setAuthor(userData);

        const postsResponse = await fetch(
          `https://blog-api-bovz.onrender.com/api/users/${id}/posts`,
        );

        const postsData = await postsResponse.json();

        if (!postsResponse.ok) {
          alert(postsData.message || "Failed to load author posts");
          setLoading(false);
          return;
        }

        setPosts(postsData);
      } catch (error) {
        console.log("FOLLOW ERROR:", error);

        alert(error.message || "Something went wrong while following user");
      }
    }

    getAuthorProfile();
  }, [id]);

  const isMyProfile = author?._id === currentUserId;

  const isFollowing = author?.followers?.some(
    (followerId) =>
      followerId === currentUserId || followerId?._id === currentUserId,
  );

  async function handleFollow() {
    if (!token) {
      alert("Please login to follow this user");
      return;
    }

    try {
      const response = await fetch(
        `https://blog-api-bovz.onrender.com/api/users/${id}/follow`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const text = await response.text();
      let data = {};

      try {
        data = JSON.parse(text);
      } catch {
        console.log("FOLLOW RAW RESPONSE:", text);
      }

      if (!response.ok) {
        alert(data.message || "Failed to follow user");
        return;
      }

      setAuthor((prevAuthor) => {
        if (!prevAuthor) {
          return prevAuthor;
        }

        const oldFollowers = prevAuthor.followers || [];

        return {
          ...prevAuthor,
          followers: data.isFollowing
            ? [...oldFollowers, currentUserId]
            : oldFollowers.filter(
                (followerId) =>
                  followerId !== currentUserId &&
                  followerId?._id !== currentUserId,
              ),
        };
      });
    } catch (error) {
      alert("Something went wrong while following user");
    }
  }

  if (loading) {
    return <Loader />;
  }

  if (!author) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">Author not found</h1>

        <Link
          to="/dashboard/explore"
          className="inline-block mt-5 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl"
        >
          Back to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen w-full">
      <Link
        to="/dashboard/explore"
        className="text-purple-600 hover:underline font-semibold"
      >
        ← Back to Explore
      </Link>

      <div className="mt-8 bg-gray-100 rounded-2xl p-6">
        <div className="bg-white rounded-xl p-6">
          <ProfileImageViewer
            src={
              author.profilePicture
                ? author.profilePicture.startsWith("http")
                  ? author.profilePicture
                  : `https://blog-api-bovz.onrender.com${author.profilePicture}`
                : ""
            }
            alt={author.username || "Author"}
            size="w-24 h-24"
          />

          <h1 className="text-4xl font-[JetBrains] font-bold mt-5">
            {author.username}
          </h1>

          <p className="text-gray-600 mt-3">
            {author.bio || "This writer has not added a bio yet."}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <div className="bg-purple-50 text-purple-700 inline-block px-4 py-2 rounded-xl font-semibold">
              Published Posts: {posts.length}
            </div>

            <div className="bg-gray-100 text-gray-700 inline-block px-4 py-2 rounded-xl font-semibold">
              Followers: {author.followers?.length || 0}
            </div>

            <div className="bg-gray-100 text-gray-700 inline-block px-4 py-2 rounded-xl font-semibold">
              Following: {author.following?.length || 0}
            </div>
          </div>

          {!isMyProfile && (
            <button
              type="button"
              onClick={handleFollow}
              className={`mt-5 px-6 py-3 rounded-xl font-bold transition ${
                isFollowing
                  ? "bg-gray-900 text-white hover:bg-black"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-5">Posts by {author.username}</h2>

        {posts.length === 0 ? (
          <div className="bg-gray-100 p-6 rounded-xl text-center">
            <p className="text-gray-500">
              This writer has no published posts yet.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {posts.map((post) => (
              <div key={post._id} className="bg-white border rounded-xl p-5">
                <h3 className="text-2xl font-bold">{post.title}</h3>

                <p className="text-purple-600 font-semibold mt-1">
                  {post.category}
                </p>

                <p className="text-gray-600 mt-3">
                  {post.content.slice(0, 160)}...
                </p>

                <Link
                  to={`/dashboard/view/${post._id}`}
                  className="inline-block mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                >
                  Read full post
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthorProfile;
