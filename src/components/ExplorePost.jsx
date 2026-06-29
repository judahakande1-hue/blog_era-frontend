import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Loader from "./Loader";
import { Search, ThumbsUp } from "lucide-react";

function ExplorePosts() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const userId = localStorage.getItem("userId");
  const mainCategories = ["All", "Technology", "Programming", "Faith"];

  const moreCategories = [
    "Web Development",
    "Design",
    "Education",
    "Business",
    "Lifestyle",
    "Personal Growth",
    "Blogging",
  ];

  useEffect(() => {
    async function getPosts() {
      const response = await fetch(
        "https://blog-api-bovz.onrender.com/api/posts",
      );
      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to fetch posts");
        setLoading(false);
        return;
      }

      setPosts(data);
      setLoading(false);
    }

    getPosts();
  }, []);

  const publishedPosts = posts.filter((post) => post.status === "Published");

  const categoryToUse = customCategory.trim() || selectedCategory;

  const filteredPosts = publishedPosts.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      categoryToUse === "All" ||
      post.category.toLowerCase().includes(categoryToUse.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <Loader />;
  }

  async function handleLike(postId) {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to like posts");
      return;
    }

    try {
      const response = await fetch(
        `https://blog-api-bovz.onrender.com/api/posts/${postId}/like`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to like post");
        return;
      }

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: data.likes,
              }
            : post,
        ),
      );
    } catch (error) {
      alert("Something went wrong while liking post");
    }
  }

  return (
    <div className="p-4 md:p-8 min-h-screen w-full mb-5">
      <h1 className="text-2xl md:text-4xl font-[JetBrains] font-bold mb-4">
        Explore Posts
      </h1>
      <p className="text-gray-600">
        Discover and read posts from other users all over the world.
      </p>
      <div className="relative mt-5">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search published posts"
          className="w-full sm:w-96 bg-gray-100 rounded-full pl-10 pr-4 py-2 focus:ring-1 focus:ring-purple-500 focus:outline-none"
        />
      </div>
      <div className="mt-6">
        <p className="font-semibold text-gray-700 mb-3">
          What kind of posts do you want to see?
        </p>

        <div className="flex flex-wrap gap-3">
          {mainCategories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setSelectedCategory(item);
                setCustomCategory("");
              }}
              className={`px-4 py-2 rounded-full border transition ${
                selectedCategory === item && customCategory === ""
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-purple-50"
              }`}
            >
              {item}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setShowMoreCategories(!showMoreCategories)}
            className="px-4 py-2 rounded-full border border-purple-600 text-purple-600 hover:bg-purple-50"
          >
            {showMoreCategories ? "Less Categories" : "More Categories"}
          </button>
        </div>

        {showMoreCategories && (
          <div className="flex flex-wrap gap-3 mt-4">
            {moreCategories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setSelectedCategory(item);
                  setCustomCategory("");
                }}
                className={`px-4 py-2 rounded-full border transition ${
                  selectedCategory === item && customCategory === ""
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-purple-50"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        )}

        <input
          value={customCategory}
          onChange={(e) => {
            setCustomCategory(e.target.value);
            setSelectedCategory("All");
          }}
          placeholder="Type a category, example: React, Life, Food..."
          className="mt-4 w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
      {publishedPosts.length === 0 ? (
        <div className="bg-gray-100 h-fit p-5 rounded-2xl mt-10 text-center">
          <div className="bg-white p-5 rounded-xl border-2 border-gray-600 border-dashed text-center">
            <h1 className="text-2xl font-bold">No published posts yet.</h1>

            <p className="text-gray-500 mt-2 mb-3">
              Published posts from BlogEra writers will appear here.
            </p>

            <Link
              to="/dashboard/create"
              className="bg-purple-600 inline-block hover:bg-purple-700 text-white px-5 py-3 rounded-xl"
            >
              Create New Post
            </Link>
          </div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-gray-100 h-fit p-5 rounded-2xl mt-10 text-center">
          <div className="bg-white p-5 rounded-xl border-2 border-gray-600 border-dashed text-center">
            <h1 className="text-2xl font-bold">No posts found.</h1>

            <p className="text-gray-500 mt-2">
              No post matches this search or category yet.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-100 h-fit p-5 rounded-2xl mt-5 space-y-5">
          {filteredPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white overflow-hidden p-5 rounded-xl text-left"
            >
              <h2 className="text-2xl font-bold">{post.title}</h2>

              <p className="text-purple-600 font-semibold mt-1">
                {post.category}
              </p>

              <p className="text-gray-600 mt-3 overflow-hidden">
                {post.content.slice(0, 150)}...
              </p>

              <button
                type="button"
                onClick={() => handleLike(post._id)}
                className={`mt-4 flex items-center gap-2 font-semibold transition ${
                  post.likes?.some((id) => id === userId || id?._id === userId)
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                <ThumbsUp
                  size={20}
                  fill={
                    post.likes?.some(
                      (id) => id === userId || id?._id === userId,
                    )
                      ? "currentColor"
                      : "none"
                  }
                />
                <span>{post.likes?.length || 0}</span>
              </button>

              <p className="text-sm text-gray-500 mt-3">
                Author:{" "}
                <Link
                  to={`/dashboard/author/${post.author?._id}`}
                  className="text-purple-600 hover:underline font-semibold"
                >
                  {post.author?.username || "Unknown"}
                </Link>
              </p>

              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <Link
                  to={`/dashboard/view/${post._id}`}
                  className="text-center w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                >
                  Read full post
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExplorePosts;
