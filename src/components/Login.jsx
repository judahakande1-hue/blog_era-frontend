import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Toast from "./Toast";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [toast, setToast] = useState({
    type: "",
    message: "",
  });

  async function handleLogin(e) {
    e.preventDefault();

    const userData = {
      email: email,
      password: password,
    };

    const response = await fetch("https://blog-api-bovz.onrender.com/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      setToast({
        type: "error",
        message: data.message || "Login failed",
      });
      return;
    }
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.user.id);
    localStorage.setItem("username", data.user.username);
    localStorage.setItem("email", data.user.email);

    setToast({
      type: "success",
      message: "Login successful",
    });

    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-gray-400 pt-24 flex flex-col items-center">
      <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 mt-6 sm:max-w-xl lg:max-w-3xl shadow-2xl rounded-xl overflow-hidden">
        <div className="bg-[url('/purple.png')] p-8 text-white sm:rounded-none lg:rounded-l-xl">
          <h1 className="font-bold text-3xl mb-5">Welcome Back to BlogEra</h1>

          <p className="mb-1">New to BlogEra? </p>

          <p>Create an account to start writing.</p>
          <Link
            to="/signup"
            className="bg-white text-purple-600 mt-3 hover:bg-gray-200 font-bold py-2 px-4 rounded-full inline-block"
          >
            Sign Up
          </Link>
        </div>

        <div className="bg-white sm:rounded-none lg:rounded-r-xl p-7 shadow-md">
          <h1 className=" font-[jetBrain] font-medium text-4xl mb-6">
            Login to BlogEra
          </h1>

          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast({ type: "", message: "" })}
          />

          <div>
            <form onSubmit={handleLogin} className="mt-12 ">
              <input
                required
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-b-1 mb-7 outline-none focus:ring-0 border-black w-60"
                type="email"
              />

              <div className="relative w-60 mb-7">
                <input
                  placeholder="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-b outline-none focus:ring-0 border-black w-full pr-8"
                  type={showPassword ? "text" : "password"}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 hover:bg-gray-900/10 p-1 rounded-full hover:scale-110 transition "
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              <button
                type="submit"
                className=" bg-purple-600 text-white  mt-3 hover:bg-purple-700 font-bold py-2 px-4 rounded-full"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="col-span-2 b w-full text-center border-t-2 p-2 border-black mt-12">
        <h1>@ 2026 BlogEra</h1>
      </div>
    </div>
  );
}
