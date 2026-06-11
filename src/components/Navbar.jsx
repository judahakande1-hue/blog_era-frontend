import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [open, setOpen] = useState(false);
  const linkClass =
    "relative px-3 py-2 text-gray-700 font-medium transition hover:text-purple-700 " +
    "after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] " +
    "after:w-0 after:bg-purple-600 after:transition-all after:duration-300 hover:after:w-full";


  return (
    <header className="fixed mb-20 top-0 left-0 w-full bg-white/80 border-b border-gray-200">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4 static ">
        <a href="/" className="flex">
          <h1
            to="/"
            className="text-3xl hover:scale-105 transition-transform cursor-pointer font-['JetBrains']"
          >
            BlogEra
          </h1>
        </a>

        <button
          className="lg:hidden text-2xl text-gray-800"
          onClick={() => setOpen(!open)}
        >
          {open ? "✕" : "☰"}
        </button>

        <nav
          onClick={() => setOpen(false)}
          className={`
            absolute lg:static top-[69.10px] left-0 w-full lg:w-auto 
            bg-white/90 lg:bg-transparent 
            px-6 py-6 lg:p-0 
            flex flex-col lg:flex-row items-center gap-6
            shadow-md lg:shadow-none
            transition-all duration-300
            ${open ? "block" : "hidden"} lg:flex
          `}
        >
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <Link to="/about" className={linkClass}>
              {" "}
              About Us
            </Link>
            <Link to="/contact" className={linkClass}>
              Contact
            </Link>
          </div>

          <Link
            to="/signup"
            className="mt-4 lg:mt-0 px-5 py-2 rounded-full bg-purple-700 text-white text-sm font-semibold shadow-md 
            hover:bg-purple-800 hover:scale-105 active:scale-95 transition "
          >
            Get started
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
