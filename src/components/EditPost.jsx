import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Toast from "./Toast";
import Loader from "./Loader";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [toast, setToast] = useState({
    type: "",
    message: "",
  });

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCategories, setShowCategories] = useState(false);

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

  useEffect(() => {
    async function getPostToEdit() {
      try {
        const response = await fetch(
          `https://blog-api-bovz.onrender.com/api/posts/${id}`,
        );

        const data = await response.json();

        if (!response.ok) {
          setToast({
            type: "error",
            message: data.message || "Failed to load post",
          });

          setLoading(false);
          return;
        }

        setTitle(data.title || "");
        setCategory(data.category || "");
        setContent(data.content || "");
        setLoading(false);
      } catch (error) {
        setToast({
          type: "error",
          message: "Something went wrong while loading post",
        });

        setLoading(false);
      }
    }

    getPostToEdit();
  }, [id]);

  async function handleUpdatePost(statusValue) {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `https://blog-api-bovz.onrender.com/api/posts/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            category,
            content,
            status: statusValue,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setToast({
          type: "error",
          message: data.message || "Failed to update post",
        });
        return;
      }

      setToast({
        type: "success",
        message:
          statusValue === "Published"
            ? "Post published successfully"
            : "Draft saved successfully",
      });

      setTimeout(() => {
        navigate("/dashboard/MyPost");
      }, 1000);
    } catch (error) {
      setToast({
        type: "error",
        message: "Something went wrong while updating post",
      });
    }
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-[JetBrains] font-bold mb-4">Edit Post</h1>

      <p className="mb-6 text-gray-600">Update your post details below.</p>

      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ type: "", message: "" })}
      />

      <div className="space-y-7">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Title
          </label>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
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
            className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-left outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
          >
            {category || "Select category"}
          </button>

          {showCategories && (
            <div className="absolute z-20 mt-2 w-full max-h-64 overflow-y-auto bg-white border border-gray-200 rounded-2xl shadow-xl p-2">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setCategory(item);
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
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm mt-5 font-semibold text-gray-700 mb-2">
            Content
          </label>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="8"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-0 focus:border-purple-600 resize-none"
          />
        </div>

        <div className="gap-5 flex flex-col sm:flex-row">
          <button
            type="button"
            onClick={() => handleUpdatePost("Draft")}
            className="border border-purple-600 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50"
          >
            Save as Draft
          </button>

          <button
            type="button"
            onClick={() => handleUpdatePost("Published")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditPost;