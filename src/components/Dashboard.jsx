import { Link } from "react-router-dom";
import {
  PenSquare,
  Library,
  Compass,
  User,
  MessageCircle,
  TrendingUp,
  Sparkles,
  BookOpen,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";

const API_URL = "https://blog-api-bovz.onrender.com";

function Dashboard() {
  const username = localStorage.getItem("username") || "Writer";
  const bio = localStorage.getItem("bio") || "No bio added yet.";
  const profilePicture = localStorage.getItem("profilePicture") || "";

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

  const quickActions = [
    {
      title: "Create New Post",
      description: "Start writing and publish a new article.",
      icon: PenSquare,
      link: "/dashboard/create",
    },
    {
      title: "My Posts",
      description: "View, edit, and manage your own posts.",
      icon: Library,
      link: "/dashboard/MyPost",
    },
    {
      title: "Explore Posts",
      description: "Read posts shared by other BlogEra writers.",
      icon: Compass,
      link: "/dashboard/explore",
    },
    {
      title: "Communities",
      description: "Join topic rooms and share ideas with others.",
      icon: MessageCircle,
      link: "/dashboard/communities",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-indigo-900 text-white rounded-3xl p-6 md:p-10 shadow-lg relative overflow-hidden">
          <div className="absolute right-8 top-8 opacity-20">
            <Sparkles size={110} />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 relative z-10">
            <div>
              <p className="uppercase tracking-[0.3em] text-sm text-purple-200">
                BlogEra Dashboard
              </p>

              <h1 className="text-3xl md:text-5xl font-bold mt-3">
                Welcome back, {username}
              </h1>

              <p className="mt-4 text-purple-100 max-w-2xl leading-7">
                Create, manage, and share your BlogEra posts. Use this dashboard
                to write new articles, organize your content, update your
                profile, explore public posts, and join topic communities.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                <Link
                  to="/dashboard/create"
                  className="bg-white text-purple-700 px-5 py-3 rounded-2xl font-semibold hover:bg-purple-50 transition flex items-center gap-2"
                >
                  <PenSquare size={18} />
                  Write a Post
                </Link>

                <Link
                  to="/dashboard/explore"
                  className="bg-white/10 border border-white/20 text-white px-5 py-3 rounded-2xl font-semibold hover:bg-white/20 transition flex items-center gap-2"
                >
                  <Compass size={18} />
                  Explore
                </Link>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 min-w-[260px]">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white text-purple-700 flex items-center justify-center font-bold text-2xl overflow-hidden">
                  {profilePicture ? (
                    <img
                      src={getImageUrl(profilePicture)}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    username.charAt(0).toUpperCase()
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-bold">{username}</h2>
                  <p className="text-purple-100 text-sm">BlogEra Writer</p>
                </div>
              </div>

              <p className="text-purple-100 text-sm leading-6 mt-4">{bio}</p>

              <Link
                to="/dashboard/profile"
                className="mt-5 inline-flex items-center gap-2 text-white font-semibold hover:underline"
              >
                Edit Profile
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <BookOpen size={24} />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-5">Write</h3>

            <p className="text-gray-500 mt-2 leading-6">
              Create useful blog posts and share your thoughts with readers.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <LayoutDashboard size={24} />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-5">Manage</h3>

            <p className="text-gray-500 mt-2 leading-6">
              Organize your posts, edit your content, and update your profile.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <TrendingUp size={24} />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-5">Connect</h3>

            <p className="text-gray-500 mt-2 leading-6">
              Explore public posts and join communities based on your interests.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 mt-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Quick Actions
                </h2>

                <p className="text-gray-500 mt-1">
                  Choose what you want to do next on BlogEra.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <Link
                    key={action.title}
                    to={action.link}
                    className="group border border-gray-100 rounded-3xl p-5 hover:shadow-md hover:border-purple-200 transition bg-gray-50 hover:bg-white"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition">
                        <Icon size={23} />
                      </div>

                      <ArrowRight
                        size={20}
                        className="text-gray-300 group-hover:text-purple-600 transition"
                      />
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mt-5">
                      {action.title}
                    </h3>

                    <p className="text-gray-500 mt-2 leading-6">
                      {action.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">
              Today’s Focus
            </h2>

            <p className="text-gray-500 mt-2 leading-6">
              Keep your BlogEra account active by writing, improving your
              profile, and reading what others have shared.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  1
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">Write something</h3>
                  <p className="text-gray-500 text-sm">
                    Create a new post or continue an idea.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  2
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    Check your posts
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Review your articles and make changes.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  3
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    Join a community
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Post under Music, Christian, Muslim, Technology, and more.
                  </p>
                </div>
              </div>
            </div>

            <Link
              to="/dashboard/communities"
              className="mt-7 w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} />
              Open Communities
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;