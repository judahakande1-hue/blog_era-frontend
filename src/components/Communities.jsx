import { useEffect, useState } from "react";
import {
  Search,
  Send,
  Music,
  Cross,

  GraduationCap,
  Laptop,
  Trophy,
  Briefcase,
  MessageCircle,
  Sparkles,
} from "lucide-react";

const API_URL = "https://blog-api-bovz.onrender.com";

function Communities() {
  const topics = [
    {
      name: "All",
      icon: MessageCircle,
      description: "See posts from all BlogEra communities in one place.",
    },
    {
      name: "Music",
      icon: Music,
      description:
        "Talk about songs, artists, worship, instruments, and music ideas.",
    },
    {
      name: "Christian",
      icon: Cross,
      description:
        "Share Christian posts, encouragement, Bible thoughts, and discussions.",
    },
    {
      name: "Education",
      icon: GraduationCap,
      description: "Discuss school, exams, learning, projects, and study tips.",
    },
    {
      name: "Technology",
      icon: Laptop,
      description: "Talk about coding, gadgets, AI, websites, and tech ideas.",
    },
    {
      name: "Sports",
      icon: Trophy,
      description: "Discuss football, games, fitness, teams, and sports news.",
    },
    {
      name: "Business",
      icon: Briefcase,
      description:
        "Share business ideas, marketing tips, sales, and money discussions.",
    },
    {
      name: "Others",
      icon: MessageCircle,
      description:
        "For general topics that do not fit into the other communities.",
    },
  ];

  const [selectedTopic, setSelectedTopic] = useState("All");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  const filteredTopics = topics.filter((topic) =>
    topic.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedTopicData = topics.find(
    (topic) => topic.name === selectedTopic
  );

  useEffect(() => {
    async function fetchCommunityPosts() {
      try {
        setLoading(true);
        setError("");

        const url =
          selectedTopic === "All"
            ? `${API_URL}/api/community`
            : `${API_URL}/api/community?topic=${selectedTopic}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to load community posts");
          setPosts([]);
          return;
        }

        setPosts(data);
      } catch (error) {
        setError("Could not connect to community posts");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCommunityPosts();
  }, [selectedTopic]);

  async function handleCreatePost(e) {
    e.preventDefault();

    if (!message.trim()) {
      return;
    }

    if (selectedTopic === "All") {
      setError("Please choose a specific topic before posting.");
      return;
    }

    try {
      setPosting(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/community`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          topic: selectedTopic,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create post");
        return;
      }

      setPosts([data, ...posts]);
      setMessage("");
    } catch (error) {
      setError("Could not post message");
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="p-4 min-h-screen bg-gray-50 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white rounded-3xl p-6 md:p-10 shadow-lg overflow-hidden relative">
          <div className="absolute right-8 top-8 opacity-20">
            <Sparkles size={90} />
          </div>

          <p className="uppercase tracking-[0.3em] text-sm text-purple-200">
            BlogEra Communities
          </p>

          <h1 className="text-3xl md:text-5xl font-bold mt-3 max-w-3xl">
            Join topic rooms and share your thoughts
          </h1>

          <p className="mt-4 text-purple-100 max-w-2xl leading-7">
            Choose a topic like Music, Christian, Muslim, Education, Technology,
            Sports, Business, or Others. Read what people posted and share your
            own message under that topic.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[330px_1fr] gap-6 mt-8">
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 h-fit">
            <h2 className="text-xl font-bold text-gray-900">Topics</h2>

            <p className="text-gray-500 mt-1 text-sm">
              Search and select the community you want to view.
            </p>

            <div className="relative mt-5">
              <Search
                className="absolute left-4 top-3.5 text-gray-400"
                size={20}
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search topics..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-100 outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="mt-5 space-y-3">
              {filteredTopics.map((topic) => {
                const Icon = topic.icon;
                const isActive = selectedTopic === topic.name;

                return (
                  <button
                    key={topic.name}
                    type="button"
                    onClick={() => {
                      setSelectedTopic(topic.name);
                      setError("");
                    }}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl text-left transition ${
                      isActive
                        ? "bg-purple-600 text-white shadow-md"
                        : "bg-gray-50 hover:bg-purple-50 text-gray-800"
                    }`}
                  >
                    <span
                      className={`w-11 h-11 rounded-full flex items-center justify-center ${
                        isActive
                          ? "bg-white/20"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      <Icon size={21} />
                    </span>

                    <span>
                      <span className="block font-bold">{topic.name}</span>

                      <span
                        className={`block text-xs mt-1 ${
                          isActive ? "text-purple-100" : "text-gray-500"
                        }`}
                      >
                        Open community
                      </span>
                    </span>
                  </button>
                );
              })}

              {filteredTopics.length === 0 && (
                <p className="text-gray-500 text-center py-6">
                  No topic found.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-purple-600 font-semibold">
                    Selected Community
                  </p>

                  <h2 className="text-3xl font-bold text-gray-900 mt-1">
                    {selectedTopic}
                  </h2>

                  <p className="text-gray-500 mt-2 max-w-2xl">
                    {selectedTopicData?.description}
                  </p>
                </div>

                <div className="bg-purple-100 text-purple-700 px-5 py-3 rounded-2xl font-bold">
                  {posts.length} posts
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                Post in {selectedTopic}
              </h3>

              <p className="text-gray-500 mt-1 text-sm">
                {selectedTopic === "All"
                  ? "Choose a specific topic before posting."
                  : "Write something you want others in this topic to see."}
              </p>

              <form onSubmit={handleCreatePost} className="mt-5">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    selectedTopic === "All"
                      ? "Choose a topic first..."
                      : `Write a post about ${selectedTopic}...`
                  }
                  disabled={selectedTopic === "All"}
                  rows="4"
                  className="w-full border border-gray-200 rounded-2xl p-4 outline-none resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100"
                />

                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    disabled={posting || selectedTopic === "All"}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2"
                  >
                    <Send size={18} />
                    {posting ? "Posting..." : "Post Message"}
                  </button>
                </div>
              </form>

              {error && (
                <p className="mt-4 text-red-600 font-semibold">{error}</p>
              )}
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                Recent posts in {selectedTopic}
              </h3>

              <div className="mt-5 space-y-4">
                {loading ? (
                  <p className="text-gray-500">Loading posts...</p>
                ) : posts.length > 0 ? (
                  posts.map((post) => (
                    <div
                      key={post._id}
                      className="border border-gray-100 rounded-2xl p-5 hover:shadow-sm transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                          {post.author?.username
                            ? post.author.username.charAt(0).toUpperCase()
                            : "U"}
                        </div>

                        <div>
                          <h4 className="font-bold text-gray-900">
                            {post.author?.username || "Unknown User"}
                          </h4>

                          <p className="text-sm text-gray-400">
                            {post.createdAt
                              ? new Date(post.createdAt).toLocaleString()
                              : "Just now"}
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-700 leading-7 mt-4">
                        {post.message}
                      </p>

                      <div className="mt-4">
                        <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                          {post.topic}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
                      <MessageCircle size={28} />
                    </div>

                    <h4 className="font-bold text-gray-900 mt-4">
                      No posts yet
                    </h4>

                    <p className="text-gray-500 mt-2">
                      {selectedTopic === "All"
                        ? "No community posts have been created yet."
                        : `Be the first person to post in ${selectedTopic}.`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Communities;