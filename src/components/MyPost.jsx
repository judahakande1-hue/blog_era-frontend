import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
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
      const userId = localStorage.getItem("userId");

      const response = await fetch("https://blog-api-bovz.onrender.com/api/posts");
      const data = await response.json();

      const myPosts = data.filter((post) => post.author?._id === userId);

      setPosts(myPosts);
      setLoading(false);
    }

    getMyPosts();
  }, []);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.category.toLowerCase().includes(search.toLowerCase()) ||
      post.content.toLowerCase().includes(search.toLowerCase()),
  );

  async function handleDelete(id) {
    const token = localStorage.getItem("token");

    const response = await fetch(`https://blog-api-bovz.onrender.com/api/posts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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
                  {post.content}
                </p>

                <p className="text-sm text-gray-500 mt-3">
                  Status: {post.status}
                </p>

                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <Link
                    to={`/dashboard/edit/${post._id}`}
                    className="text-center border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-4 py-2 rounded-lg"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyPosts;
