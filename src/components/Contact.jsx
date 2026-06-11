import { useState } from "react";
import Toast from "./Toast";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [toast, setToast] = useState({
    type: "",
    message: "",
  });

  async function handleContactSubmit(e) {
    e.preventDefault();

    const response = await fetch("https://blog-api-bovz.onrender.com/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        subject,
        message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setToast({
        type: "error",
        message: data.message || "Failed to send message",
      });
      return;
    }

    setToast({
      type: "success",
      message: "Message sent successfully",
    });

    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  }
  return (
    <section className="min-h-screen bg-gray-400 pt-24 md:pt-30 bg-[radial-gradient(circle,#111_0.5px,transparent_1px)] bg-[length:24px_24px]">
      <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium font-['JetBrains'] mb-4">
            Contact Us
          </h1>

          <p className="text-gray-900 mb-8">
            Have a question? Send us a message and we’ll reply soon.
          </p>

          <div className="space-y-5 text-gray-900">
            <p>
              <span className="font-semibold">Email:</span>
              <br />
              support@example.com
            </p>

            <p>
              <span className="font-semibold">Phone:</span>
              <br />
              +234 800 123 4567
            </p>

            <p>
              <span className="font-semibold">Address:</span>
              <br />
              Abuja, Nigeria
            </p>
          </div>
        </div>

        <form
          onSubmit={handleContactSubmit}
          className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl"
        >
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast({ type: "", message: "" })}
          />

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            type="text"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-5 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            type="email"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-5 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />

          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            type="text"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-5 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message"
            rows="6"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 resize-none outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />

          <button
            type="submit"
            className="mt-5 w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Send Message
          </button>
        </form>
      </div>

      <div className="text-center border-t-2 p-2 border-black mt-5">
        <h1>@ 2026 BlogEra</h1>
      </div>
    </section>
  );
}
