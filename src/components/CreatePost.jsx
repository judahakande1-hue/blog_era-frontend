import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import Toast from "./Toast";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [toast, setToast] = useState({
    type: "",
    message: "",
  });

  const navigate = useNavigate();

  const categories = [
    "Technology",
    "Web Development",
    "Programming",
    "Design",
    "Education",
    "Business",
    "Lifestyle",
    "Personal Growth",
    "Blogging",
    "Faith",
  ];

  async function handleSaveDraft() {
    const token = localStorage.getItem("token");
    const finalCategory = customCategory.trim() || category;

    const response = await fetch(
      "https://blog-api-bovz.onrender.com/api/posts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          category: finalCategory,
          status: "Draft",
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      setToast({
        type: "error",
        message: data.message || "Failed to save draft",
      });
      return;
    }

    setToast({
      type: "success",
      message: "Draft saved successfully",
    });

    setTimeout(() => {
      navigate("/dashboard/MyPost");
    }, 1000);
  }

  async function handlePublish() {
    const token = localStorage.getItem("token");
    const finalCategory = customCategory.trim() || category;

    const response = await fetch(
      "https://blog-api-bovz.onrender.com/api/posts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          category: finalCategory,
          status: "Published",
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      setToast({
        type: "error",
        message: data.message || "Failed to publish post",
      });
      return;
    }

    setToast({
      type: "success",
      message: "Post published successfully",
    });

    setTimeout(() => {
      navigate("/dashboard/MyPost");
    }, 1000);
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-[JetBrains] font-bold mb-4">
        Create New Post
      </h1>

      <p className="mb-6 text-gray-600">
        Write and publish your ideas to BlogEra.
      </p>

      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ type: "", message: "" })}
      />

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Title
        </label>

        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Enter post title"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-0 focus:border-purple-600"
        />
      </div>

      <div className="block mt-7 relative">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Category
        </label>

        <button
          type="button"
          onClick={() => setShowCategories(!showCategories)}
          className="w-full flex justify-between items-center bg-white border border-gray-300 rounded-xl px-4 py-3 text-left outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
        >
          {category || "Select category"}
          {showCategories ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {showCategories && (
          <div className="absolute z-20 mt-2 w-full max-h-64 overflow-y-auto bg-white border border-gray-200 rounded-2xl shadow-xl p-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setCategory(item);
                  setCustomCategory("");
                  setShowCustomCategoryInput(false);
                  setShowCategories(false);
                }}
                className={`block w-full text-left px-4 py-3 rounded-xl transition ${
                  category === item
                    ? "bg-purple-600 text-white"
                    : "hover:bg-purple-100 text-gray-700"
                }`}
              >
                {item}
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                setShowCustomCategoryInput(true);
                setShowCategories(false);
                setCategory("");
              }}
              className="block w-full text-left px-4 py-3 rounded-xl transition hover:bg-purple-100 text-gray-700 font-semibold"
            >
              More / Custom Category
            </button>
          </div>
        )}

        {showCustomCategoryInput && (
          <input
            value={customCategory}
            onChange={(e) => {
              setCustomCategory(e.target.value);
              setCategory(e.target.value);
            }}
            placeholder="Type your own category, example: React, Food, AI..."
            className="mt-4 w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        )}
      </div>

      <div className="mt-7">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Content
        </label>

        <textarea
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="8"
          placeholder="Write your post content here..."
          className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-0 focus:border-purple-600 resize-none"
        />
      </div>

      <div className="mt-7">
        <button
          type="button"
          onClick={handleSaveDraft}
          className="border mr-4 cursor-pointer hover:bg-purple-100 border-purple-600 text-purple-600 px-5 py-3 rounded-xl"
        >
          Save Draft
        </button>

        <button
          type="button"
          onClick={handlePublish}
          className="bg-purple-600 cursor-pointer hover:bg-purple-700 text-white px-5 py-3 rounded-xl"
        >
          Publish Post
        </button>
      </div>
    </div>
  );
}

export default CreatePost;
