import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  PenSquare,
  Library,
  Compass,
  User,
  MessageCircle,
  ThumbsUp,
  Eye,
  FileText,
  Sparkles,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";

const API_URL = "https://blog-api-bovz.onrender.com";

function Dashboard() {
  const username = localStorage.getItem("username") || "Writer";
  const bio = localStorage.getItem("bio") || "";
  const profilePicture = localStorage.getItem("profilePicture") || "";
  const userId = localStorage.getItem("userId");

  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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
    async function getDashboardData() {
      try {
        const response = await fetch(`${API_URL}/api/posts`);
        const data = await response.json();

        if (!response.ok) {
          setLoading(false);
          return;
        }

        const userPosts = data.filter((post) => {
          const authorId =
            typeof post.author === "string" ? post.author : post.author?._id;

          return authorId === userId;
        });

        setMyPosts(userPosts);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }

    getDashboardData();
  }, [userId]);

  const publishedPosts = myPosts.filter((post) => post.status === "Published");
  const draftPosts = myPosts.filter((post) => post.status !== "Published");

  const totalLikes = myPosts.reduce((total, post) => {
    return total + (post.likes?.length || 0);
  }, 0);

  const totalViews = myPosts.reduce((total, post) => {
    return total + (post.views || 0);
  }, 0);

  const recentPosts = [...myPosts].slice(0, 3);

  const stats = [
    {
      title: "My Posts",
      value: myPosts.length,
      icon: FileText,
      description: "All posts you have created",
    },
    {
      title: "Published",
      value: publishedPosts.length,
      icon: Sparkles,
      description: "Posts visible to readers",
    },
    {
      title: "Drafts",
      value: draftPosts.length,
      icon: Library,
      description: "Posts still being prepared",
    },
    {
      title: "Total Likes",
      value: totalLikes,
      icon: ThumbsUp,
      description: "Likes received on your posts",
    },
    {
      title: "Total Views",
      value: totalViews,
      icon: Eye,
      description: "Views across your posts",
    },
    {
      title: "Communities",
      value: "Live",
      icon: MessageCircle,
      description: "Join topic discussions",
    },
  ];

  const actions = [
    {
      title: "Create New Post",
      text: "Write and publish a new blog article.",
      icon: PenSquare,
      link: "/dashboard/create",
    },
    {
      title: "My Posts",
      text: "View, edit, and manage your own posts.",
      icon: Library,
      link: "/dashboard/MyPost",
    },
    {
      title: "Explore Posts",
      text: "Read posts from other BlogEra writers.",
      icon: Compass,
      link: "/dashboard/explore",
    },
    {
      title: "Communities",
      text: "Post and discuss inside topic rooms.",
      icon: MessageCircle,
      link: "/dashboard/communities",
    },
    {
      title: "Profile Settings",
      text: "Update your username, bio, and picture.",
      icon: User,
      link: "/dashboard/profile",
    },
  ];

  return (
    <div className="p-4 md:p-8 min-h-screen w-full bg-white">
      <div className="bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white overflow-hidden relative">
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-white/10 rounded-full"></div>
        <div className="absolute right-20 bottom-6 w-24 h-24 bg-white/10 rounded-full"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full mb-5">
              <LayoutDashboard size={18} />
              <span className="text-sm font-semibold">Creator Dashboard</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-[JetBrains] font-bold">
              Welcome back, {username}
            </h1>

            <p className="mt-4 max-w-2xl text-purple-100 leading-7">
              Create posts, manage your content, track your engagement, update
              your profile, and join BlogEra communities.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                to="/dashboard/create"
                className="bg-white text-purple-700 hover:bg-purple-50 px-5 py-3 rounded-xl font-bold inline-flex items-center justify-center gap-2"
              >
                <PenSquare size={18} />
                Create Post
              </Link>

              <Link
                to="/dashboard/explore"
                className="bg-purple-900/30 hover:bg-purple-900/40 text-white px-5 py-3 rounded-xl font-bold inline-flex items-center justify-center gap-2"
              >
                Explore Posts
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="bg-white/15 backdrop-blur rounded-2xl p-5 min-w-full sm:min-w-[300px] lg:min-w-[330px]">
            <div className="flex items-center gap-4">
              {profilePicture ? (
                <img
                  src={getImageUrl(profilePicture)}
                  alt={username}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white/40"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-white text-purple-700 flex items-center justify-center text-3xl font-bold">
                  {username.charAt(0).toUpperCase()}
                </div>
              )}

              <div>
                <h2 className="text-2xl font-bold">{username}</h2>
                <p className="text-purple-100 text-sm mt-1">
                  {bio || "BlogEra writer"}
                </p>
              </div>
            </div>

            <Link
              to="/dashboard/profile"
              className="mt-5 inline-block w-full text-center bg-white/20 hover:bg-white/30 rounded-xl py-3 font-semibold"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Performance</h2>

        {loading ? (
          <div className="bg-gray-100 rounded-2xl p-6 text-gray-500">
            Loading dashboard information...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {stats.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="bg-gray-100 rounded-2xl p-5 border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-purple-600">
                      <Icon size={24} />
                    </div>

                    <p className="text-3xl font-bold text-gray-900">
                      {item.value}
                    </p>
                  </div>

                  <h3 className="font-bold text-lg mt-5">{item.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-10 bg-purple-50  rounded-3xl border-2 border-gray-100 p-12 grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {actions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.title}
                  to={action.link}
                  className="bg-gray-100 hover:bg-purple-40 border border-gray-200 hover:border-purple-300 rounded-2xl p-5 transition group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition">
                      <Icon size={24} />
                    </div>

                    <div>
                      <h3 className="font-bold text-lg">{action.title}</h3>
                      <p className="text-gray-500 text-sm mt-1">
                        {action.text}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Posts</h2>

          <div className="bg-gray-100 rounded-2xl p-5">
            {recentPosts.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                <p className="font-bold text-lg">No posts yet</p>
                <p className="text-gray-500 mt-2">
                  Create your first post and it will appear here.
                </p>

                <Link
                  to="/dashboard/create"
                  className="inline-block mt-4 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-semibold"
                >
                  Create Post
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div
                    key={post._id}
                    className="bg-white rounded-xl p-4 border border-gray-200"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-lg line-clamp-1">
                          {post.title}
                        </h3>

                        <p className="text-purple-600 text-sm font-semibold mt-1">
                          {post.category || "Uncategorized"}
                        </p>
                      </div>

                      <span
                        className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          post.status === "Published"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {post.status || "Draft"}
                      </span>
                    </div>

                    <p className="text-gray-500 text-sm mt-3 line-clamp-2">
                      {post.content}
                    </p>

                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <ThumbsUp size={16} />
                          {post.likes?.length || 0}
                        </span>

                        <span className="flex items-center gap-1">
                          <Eye size={16} />
                          {post.views || 0}
                        </span>
                      </div>

                      <Link
                        to={`/dashboard/view/${post._id}`}
                        className="text-purple-600 hover:underline font-semibold"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10 bg-purple-50 border border-purple-100 rounded-2xl p-6">
        <h2 className="text-2xl font-bold">Today’s Focus</h2>

        <p className="text-gray-600 mt-2 leading-7">
          Keep creating useful posts and engaging with other writers. The more
          helpful your posts are, the more views and likes they can receive.
        </p>

        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <Link
            to="/dashboard/create"
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-semibold text-center"
          >
            Write Something New
          </Link>

          <Link
            to="/dashboard/communities"
            className="bg-white hover:bg-gray-50 text-purple-700 border border-purple-200 px-5 py-3 rounded-xl font-semibold text-center"
          >
            Visit Communities
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;