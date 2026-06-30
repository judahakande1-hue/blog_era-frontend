import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, Eye, ThumbsUp } from "lucide-react";
import Toast from "./Toast";
import Loader from "./Loader";

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    type: "",
    message: "",
  });

  
  useEffect(() => {
    async function getMyPosts() {
      try {
        const userId = localStorage.getItem("userId");

        const response = await fetch(
          "https://blog-api-bovz.onrender.com/api/posts",
        );

        const data = await response.json();

        if (!response.ok) {
          setToast({
            type: "error",
            message: data.message || "Failed to fetch posts",
          });
          setLoading(false);
          return;
        }

        const myPosts = data.filter((post) => post.author?._id === userId);

        setPosts(myPosts);
        setLoading(false);
      } catch (error) {
        setToast({
          type: "error",
          message: "Something went wrong while loading your posts",
        });
        setLoading(false);
      }
    }

    getMyPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const title = post.title || "";
    const category = post.category || "";
    const content = post.content || "";

    return (
      title.toLowerCase().includes(search.toLowerCase()) ||
      category.toLowerCase().includes(search.toLowerCase()) ||
      content.toLowerCase().includes(search.toLowerCase())
    );
  });

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?",
    );

    if (!confirmDelete) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `https://blog-api-bovz.onrender.com/api/posts/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setToast({
          type: "error",
          message: data.message || "Failed to delete post",
        });
        return;
      }

      setToast({
        type: "success",
        message: "Post deleted successfully",
      });

      const remainingPosts = posts.filter((post) => post._id !== id);
      setPosts(remainingPosts);
    } catch (error) {
      setToast({
        type: "error",
        message: "Something went wrong while deleting post",
      });
    }
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-4 md:p-8 min-h-screen w-full mb-5">
      {posts.length === 0 ? (
        <div>
          <h1 className="text-2xl md:text-4xl font-[JetBrains] font-bold mb-4">
            My Posts
          </h1>

          <p className="text-gray-600">
            View, edit, and manage all posts you have created.
          </p>

          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast({ type: "", message: "" })}
          />

          <div className="relative mt-5">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for your post"
              className="w-70 bg-gray-100 rounded-full pl-10 pr-4 py-2 focus:ring-1 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <div className="bg-gray-100 h-fit p-5 rounded-2xl mt-10 text-center">
            <div className="bg-white p-5 rounded-xl border-2 border-gray-600 border-dashed text-center">
              <h1 className="text-2xl font-bold">No posts yet</h1>

              <p className="text-gray-500 mt-2 mb-3">
                You have not created any posts yet. Start by creating your first
                blog post.
              </p>

              <Link
                to="/dashboard/create"
                className="bg-purple-600 inline-block hover:bg-purple-700 text-white px-5 py-3 rounded-xl"
              >
                Create New Post
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl md:text-4xl font-[JetBrains] font-bold mb-4">
            My Posts
          </h1>

          <p className="text-gray-600">
            View, edit, and manage all posts you have created.
          </p>

          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast({ type: "", message: "" })}
          />

          <div className="relative mt-5">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for your post"
              className="w-70 bg-gray-100 rounded-full pl-10 pr-4 py-2 focus:ring-1 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <div className="bg-gray-100 h-fit p-5 rounded-2xl mt-5 space-y-5">
            {filteredPosts.length === 0 ? (
              <div className="bg-white p-5 rounded-xl border-2 border-gray-600 border-dashed text-center">
                <h1 className="text-2xl font-bold">No posts found</h1>

                <p className="text-gray-500 mt-2">
                  No post matches your search.
                </p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white overflow-hidden p-5 rounded-xl text-left"
                >
                  <h2 className="text-2xl font-bold">{post.title}</h2>

                  <p className="text-purple-600 font-semibold mt-1">
                    {post.category || "Uncategorized"}
                  </p>

                  <p className="text-gray-600 mt-3 overflow-hidden whitespace-pre-line break-words">
                    {post.content}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span>Status: {post.status || "Draft"}</span>

                    <span className="flex items-center gap-1">
                      <Eye size={16} />
                      {post.views || 0} views
                    </span>

                    <span className="flex items-center gap-1">
                      <ThumbsUp size={16} />
                      {post.likes?.length || 0} likes
                    </span>
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <Link
                      to={`/dashboard/view/${post._id}`}
                      className="text-center border border-gray-700 text-gray-700 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-lg"
                    >
                      View
                    </Link>

                    <Link
                      to={`/dashboard/edit/${post._id}`}
                      className="text-center border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-4 py-2 rounded-lg"
                    >
                      {post.status === "Draft" ? "Continue Draft" : "Edit"}
                    </Link>

                    <button
                      onClick={() => handleDelete(post._id)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyPosts;
