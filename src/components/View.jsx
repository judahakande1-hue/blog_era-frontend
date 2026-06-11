import { Link, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Toast from "./Toast";
import Loader from "./Loader";

function ViewPost() {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState({
    type: "",
    message: "",
  });

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    async function getPostAndComments() {
      const userId = localStorage.getItem("userId");

      const postResponse = await fetch(
        `https://blog-api-bovz.onrender.com/api/posts/${id}`,
        {
          headers: {
            "x-user-id": userId,
          },
        },
      );
      const postData = await postResponse.json();

      if (!postResponse.ok) {
        setPost(null);
        setLoading(false);
        return;
      }

      setPost(postData);

      const commentResponse = await fetch(
        `https://blog-api-bovz.onrender.com/api/comments/post/${id}`,
      );

      const commentData = await commentResponse.json();

      if (!commentResponse.ok) {
        setToast({
          type: "error",
          message: commentData.message || "Failed to load comments",
        });
        setLoading(false);
        return;
      }

      setComments(commentData);
      setLoading(false);
    }

    getPostAndComments();
  }, [id]);

  async function handleAddComment(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const response = await fetch(
      `https://blog-api-bovz.onrender.com/api/comments/post/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: commentText,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      setToast({
        type: "error",
        message: data.message || "Failed to add comment",
      });
      return;
    }

    setComments([data, ...comments]);
    setCommentText("");

    setToast({
      type: "success",
      message: "Comment added successfully",
    });
  }

  async function handleDeleteComment(commentId) {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `https://blog-api-bovz.onrender.com/api/comments/${commentId}`,
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
        message: data.message || "Failed to delete comment",
      });
      return;
    }

    const remainingComments = comments.filter(
      (comment) => comment._id !== commentId,
    );

    setComments(remainingComments);

    setToast({
      type: "success",
      message: "Comment deleted successfully",
    });
  }

  if (loading) {
    return <Loader />;
  }
  if (!post) {
    return (
      <div className="p-4 md:p-8">
        <h1 className="text-3xl font-bold">Post not found</h1>

        <p className="text-gray-600 mt-2">
          This post may have been deleted or does not exist.
        </p>

        <Link
          to="/dashboard/explore"
          className="inline-block mt-5 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl"
        >
          Back to Explore Posts
        </Link>
      </div>
    );
  }

  const userId = localStorage.getItem("userId");

  return (
    <div className="p-4 md:p-8 min-h-screen w-full">
      <Link
        to="/dashboard/explore"
        className="text-purple-600 hover:underline font-semibold"
      >
        ← Back to Explore Posts
      </Link>

      <div className="mt-8 bg-gray-100 rounded-2xl p-4 md:p-8">
        <div className="bg-white rounded-xl p-4 md:p-8">
          <p className="text-purple-600 font-semibold mb-3">{post.category}</p>

          <h1 className="text-2xl md:text-4xl font-[JetBrains] font-bold mb-4">
            {post.title}
          </h1>

          <p className="text-sm text-gray-500 mb-4">
            Author: {post.author?.username || "Unknown"}
          </p>

          <p className="text-gray-700 mb-6 whitespace-pre-line break-words">
            {post.content}
          </p>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-gray-500 mb-8">
            <p>Status: {post.status}</p>
            <p>Views: {post.views || 0}</p>
            <p>Comments: {comments.length}</p>
          </div>
        </div>
      </div>
      <div className="mt-8 bg-gray-100 rounded-2xl p-4 md:p-8">
        <div className="bg-white rounded-xl p-4 md:p-8">
          <h2 className="text-2xl font-bold mb-4">Comments</h2>

          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast({ type: "", message: "" })}
          />

          <form onSubmit={handleAddComment} className="mb-8">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write your comment..."
              rows="4"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 resize-none outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />

            <button
              type="submit"
              className="mt-4 w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl"
            >
              Add Comment
            </button>
          </form>

          {comments.length === 0 ? (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 text-center">
              <p className="text-gray-500">
                No comments yet. Be the first to comment.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="border border-gray-200 rounded-xl p-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <p className="font-bold text-purple-600">
                        {comment.author?.username || "Unknown user"}
                      </p>

                      <p className="text-gray-700 mt-2 break-words">{comment.text}</p>
                    </div>

                    {comment.author?._id === userId && (
                      <button
                        type="button"
                        onClick={() => handleDeleteComment(comment._id)}
                        className="w-full sm:w-auto text-red-600 hover:text-red-700 font-semibold"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewPost;
