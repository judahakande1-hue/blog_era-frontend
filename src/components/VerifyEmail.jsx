import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Toast from "./Toast";

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || "");
  const [code, setCode] = useState("");

  const [toast, setToast] = useState({
    type: "",
    message: "",
  });

  async function handleVerifyEmail(e) {
    e.preventDefault();

    const response = await fetch(
      "https://blog-api-bovz.onrender.com/api/auth/verify-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      setToast({
        type: "error",
        message: data.message || "Email verification failed",
      });
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.user.id);
    localStorage.setItem("username", data.user.username);
    localStorage.setItem("email", data.user.email);

    setToast({
      type: "success",
      message: "Email verified successfully",
    });

    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  }

  async function handleResendCode() {
    const response = await fetch(
      "https://blog-api-bovz.onrender.com/api/auth/resend-verification",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      setToast({
        type: "error",
        message: data.message || "Failed to resend code",
      });
      return;
    }

    setToast({
      type: "success",
      message: "New verification code sent to your email",
    });
  }

  return (
    <div className="min-h-screen bg-gray-400 pt-24 px-4 flex flex-col items-center bg-[radial-gradient(circle,#111_0.5px,transparent_1px)] bg-[length:24px_24px]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-['JetBrains'] font-bold mb-4">
          Verify Email
        </h1>

        <p className="text-gray-600 mb-6">
          Enter the 6-digit code sent to your email address.
        </p>

        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ type: "", message: "" })}
        />

        <form onSubmit={handleVerifyEmail}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            type="email"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-5 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />

          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter verification code"
            type="text"
            maxLength="6"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-5 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-semibold"
          >
            Verify Email
          </button>
        </form>

        <button
          type="button"
          onClick={handleResendCode}
          className="w-full mt-4 border border-purple-600 text-purple-600 hover:bg-purple-50 px-5 py-3 rounded-xl font-semibold"
        >
          Resend Code
        </button>

        <p className="text-sm text-gray-500 mt-5 text-center">
          Already verified?{" "}
          <Link to="/login" className="text-purple-600 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default VerifyEmail;
