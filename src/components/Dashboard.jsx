import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Loader from "./Loader";

function Dashboard() {
  const username = localStorage.getItem("username") || "User";
  const [posts, setPosts] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const totalPosts = posts.length;
  const recentPosts = posts.slice(0, 3);
  const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);

  useEffect(() => {
    async function getDashboardPosts() {
      const userId = localStorage.getItem("userId");

      const response = await fetch(
        "https://blog-api-bovz.onrender.com/api/posts",
      );
      const data = await response.json();

      if (!response.ok) {
        console.log(data.message || "Failed to fetch dashboard posts");
        return;
      }

      const myPosts = data.filter((post) => post.author?._id === userId);

      setPosts(myPosts);
      setLoading(false);

      const commentsResults = await Promise.all(
        myPosts.map(async (post) => {
          const commentResponse = await fetch(
            `https://blog-api-bovz.onrender.com/api/comments/post/${post._id}`,
          );

          const commentData = await commentResponse.json();

          if (!commentResponse.ok) {
            return 0;
          }

          return commentData.length;
        }),
      );

      const allComments = commentsResults.reduce(
        (sum, count) => sum + count,
        0,
      );

      setTotalComments(allComments);
    }

    getDashboardPosts();
  }, [location.key]);

  const publishedPosts = posts.filter(
    (post) => post.status === "Published",
  ).length;

  const draftPosts = posts.filter((post) => post.status === "Draft").length;

  if (loading) {
    return <Loader />;
  }
  return (
    <section className="min-h-screen w-full px-4 py-6 sm:px-6 lg:px-8 mb-5">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-[JetBrains] font-bold mb-4">
        Welcome, {username}!
      </h1>

      <p className="text-gray-600 text-sm sm:text-base">
        Here you can write new posts, manage your articles, and check your
        activity.
      </p>

      <div className="mt-8 bg-gray-100 p-4 sm:p-5 rounded-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-5 gap-4">
          <div className="bg-white rounded-xl p-5 text-center">
            <h2 className="text-base sm:text-lg font-bold">Total Posts:</h2>
            <p className="text-2xl text-purple-600 font-bold">{totalPosts}</p>
          </div>

          <div className="bg-white rounded-xl p-5 text-center">
            <h2 className="text-base sm:text-lg font-bold">Drafts:</h2>
            <p className="text-2xl text-purple-600 font-bold">{draftPosts}</p>
          </div>

          <div className="bg-white rounded-xl p-5 text-center">
            <h2 className="text-base sm:text-lg font-bold">Published:</h2>
            <p className="text-2xl text-purple-600 font-bold">
              {publishedPosts}
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 text-center">
            <h2 className="text-base sm:text-lg font-bold">Views:</h2>
            <p className="text-2xl text-purple-600 font-bold">{totalViews}</p>
          </div>

          <div className="bg-white rounded-xl p-5 text-center">
            <h2 className="text-base sm:text-lg font-bold">Comments:</h2>
            <p className="text-2xl text-purple-600 font-bold">
              {totalComments}
            </p>
          </div>
        </div>

        <hr className="border-gray-200" />

        <div className="mt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="font-semibold font-[JetBrains Mono] text-lg">
            Writer Tools
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              to="/dashboard/create"
              className="w-full sm:w-auto text-center hover:bg-purple-50 text-purple-600 px-4 py-2 rounded-md border border-purple-600"
            >
              Create New Post
            </Link>

            <Link
              to="/dashboard/MyPost"
              className="w-full sm:w-auto text-center bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md"
            >
              My Posts
            </Link>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 bg-white p-4 sm:p-5 rounded-xl">
          <h1 className="font-semibold font-[JetBrains Mono] mb-5 text-lg">
            My Recent Posts
          </h1>

          {posts.length === 0 ? (
            <div className="border-2 border-gray-600 border-dashed text-center p-5 rounded-xl">
              <p className="text-gray-500 mt-2 text-sm sm:text-base">
                You haven't written any posts yet. Start creating content to see
                it here!
              </p>

              <Link
                to="/dashboard/create"
                className="inline-block mt-5 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl"
              >
                Create New Post
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {recentPosts.map((post) => (
                <div key={post._id} className="border-b border-gray-200 pb-4">
                  <h2 className="font-bold mb-2 text-base sm:text-lg break-words">
                    {post.title}
                  </h2>

                  <p className="text-purple-600 text-sm sm:text-base">
                    {post.category}
                  </p>

                  <p className="text-gray-600 text-sm sm:text-base break-words">
                    {post.content.slice(0, 120)}...
                  </p>

                  <p className="text-gray-700 py-1 text-sm sm:text-base">
                    Status: {post.status}
                  </p>

                  <Link
                    to={`/dashboard/view/${post._id}`}
                    className="text-purple-600 py-2 rounded-md text-sm sm:text-base"
                  >
                    View full post
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
