import { useState } from "react";
import ExplorePosts from "./ExplorePost";
import FindWriters from "./FindWriters";

function Explore() {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="p-4 md:p-8 min-h-screen w-full">
      <h1 className="text-3xl md:text-4xl font-[JetBrains] font-bold mb-4">
        Explore
      </h1>

      <p className="text-gray-600 mb-3">
        Discover posts, writers, and new voices across BlogEra.
      </p>

      <div className="bg-gray-100 rounded-2xl p-2 mb-3 justify-center align-middle inline-flex gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("posts")}
          className={`px-5 py-2 rounded-xl font-semibold transition ${
            activeTab === "posts"
              ? "bg-purple-600 text-white"
              : "text-gray-700 hover:bg-white"
          }`}
        >
          Posts
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("writers")}
          className={`px-5 py-2 rounded-xl font-semibold transition ${
            activeTab === "writers"
              ? "bg-purple-600 text-white"
              : "text-gray-700 hover:bg-white"
          }`}
        >
          Writers
        </button>
      </div>

      {activeTab === "posts" && <ExplorePosts />}
      {activeTab === "writers" && <FindWriters />}
    </div>
  );
}

export default Explore;
