import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  House,
  PenSquare,
  Library,
  Compass,
  CircleUserRound,
  LogOut,
  Menu,
  X,
  User,
} from "lucide-react";

function DashboardHeader() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("bio");

    setMenuOpen(false);
    navigate("/login");
  }

  const normalLink =
    "flex items-center gap-2 rounded-xl p-3 text-gray-700 hover:bg-gray-200 transition";

  const activeLink =
    "flex items-center gap-2 rounded-xl p-3 bg-purple-600 text-white font-semibold";

  function closeMenu() {
    setMenuOpen(false);
  }

  const menuLinks = (
    <>
      <NavLink
        to="/dashboard"
        end
        onClick={closeMenu}
        className={({ isActive }) => (isActive ? activeLink : normalLink)}
      >
        <House size={20} />
        Dashboard
      </NavLink>

      <NavLink
        to="/dashboard/create"
        onClick={closeMenu}
        className={({ isActive }) => (isActive ? activeLink : normalLink)}
      >
        <PenSquare size={20} />
        Create Post
      </NavLink>

      <NavLink
        to="/dashboard/MyPost"
        onClick={closeMenu}
        className={({ isActive }) => (isActive ? activeLink : normalLink)}
      >
        <Library size={20} />
        My Posts
      </NavLink>

      <NavLink
        to="/dashboard/explore"
        onClick={closeMenu}
        className={({ isActive }) => (isActive ? activeLink : normalLink)}
      >
        <Compass size={20} />
        Explore Posts
      </NavLink>

      <NavLink
        to="/dashboard/communities"
        onClick={closeMenu}
        className={({ isActive }) => (isActive ? activeLink : normalLink)}
      >
        <User size={20} />
        Communities
      </NavLink>

      <NavLink
        to="/dashboard/profile"
        onClick={closeMenu}
        className={({ isActive }) => (isActive ? activeLink : normalLink)}
      >
        <CircleUserRound size={20} />
        Profile
      </NavLink>

      <button
        onClick={handleLogout}
        className="w-full md:mt-2 hover:bg-red-50 rounded-xl p-3 cursor-pointer flex items-start gap-2 text-left text-red-600 transition"
      >
        <LogOut size={20} className="mt-1" />

        <div>
          <p className="font-semibold">Logout</p>
          <p className="text-xs text-red-500">
            Sign out of your BlogEra account.
          </p>
        </div>
      </button>
    </>
  );

  return (
    <>
      <aside className="hidden md:block min-h-screen p-5 sticky top-0 h-screen bg-gray-100 border-r border-gray-200">
        <NavLink to="/dashboard" className="flex">
          <h1 className="text-4xl hover:scale-105 transition-transform cursor-pointer font-['JetBrains']">
            BlogEra
          </h1>
        </NavLink>

        <nav className="mt-10 space-y-3">{menuLinks}</nav>
      </aside>

      <header className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <NavLink to="/dashboard" onClick={closeMenu}>
          <h1 className="text-2xl font-['JetBrains'] font-bold">BlogEra</h1>
        </NavLink>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-xl hover:bg-gray-100"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </header>

      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/40">
          <div className="bg-white w-72 max-w-[85%] min-h-screen p-5 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-['JetBrains'] font-bold">BlogEra</h1>

              <button
                type="button"
                onClick={closeMenu}
                className="p-2 rounded-xl hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="space-y-3">{menuLinks}</nav>
          </div>
        </div>
      )}
    </>
  );
}

export default DashboardHeader;
