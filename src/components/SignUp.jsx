import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Toast from "./Toast";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [toast, setToast] = useState({
    type: "",
    message: "",
  });

  async function handleSignUp(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const userData = {
        username,
        email,
        password,
      };

      const response = await fetch(
        "https://blog-api-bovz.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setToast({
          type: "error",
          message: data.message || "Signup failed",
        });
        return;
      }

      setToast({
        type: "success",
        message: data.message || "Account created successfully",
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id || data.user._id);
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("email", data.user.email);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      setToast({
        type: "error",
        message: "Cannot connect to backend. Try again.",
      });
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen bg-gray-400 pt-24 px-4 flex flex-col items-center">
      <div className="w-full max-w-md lg:max-w-3xl flex flex-col-reverse lg:grid lg:grid-cols-2 mt-6 shadow-2xl rounded-xl overflow-hidden">
        <div className="bg-[url('/purple.png')] bg-cover bg-center p-8 text-white sm:rounded-none lg:rounded-l-xl">
          <h1 className="font-bold text-2xl md:text-3xl mb-5">
            Welcome Back to BlogEra
          </h1>

          <p className="mb-1">
            Already have an account? Log in to continue your blogging journey.
          </p>

          <p>
            Read amazing stories, share your ideas, and manage your posts easily
            from one beautiful place.
          </p>

          <Link
            to="/login"
            className="bg-white text-purple-600 mt-4 hover:bg-gray-200 font-bold py-2 px-4 rounded-full inline-block"
          >
            Login
          </Link>
        </div>

        <div className="bg-white sm:rounded-none lg:rounded-r-xl p-6 md:p-7 shadow-md">
          <h1 className="font-[jetBrain] font-medium text-3xl md:text-4xl mb-6">
            Sign Up to BlogEra
          </h1>

          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast({ type: "", message: "" })}
          />

          <form onSubmit={handleSignUp} className="mt-8">
            <input
              required
              placeholder="User name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border-b mb-7 outline-none focus:ring-0 border-black w-full"
              type="text"
            />

            <input
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-b mb-7 outline-none focus:ring-0 border-black w-full"
              type="email"
            />

            <div className="relative w-full mb-7">
              <input
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-b outline-none focus:ring-0 border-black w-full pr-8"
                type={showPassword ? "text" : "password"}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-0 hover:bg-gray-900/10 p-1 rounded-full hover:scale-110 transition"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-purple-600 text-white mt-3 hover:bg-purple-700 font-bold py-2 px-6 rounded-full disabled:bg-gray-400"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>

      <div className="w-full text-center border-t-2 p-2 border-black mt-12">
        <h1>@ 2026 BlogEra</h1>
      </div>
    </div>
  );
}
