import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import SignUp from "./components/SignUp";
import Login from "./components/Login";

import DashboardHeader from "./components/Dashboard-Header";
import Dashboard from "./components/Dashboard";
import CreatePost from "./components/CreatePost";
import MyPosts from "./components/MyPost";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
import Explore from "./components/Explore";
import ViewPost from "./components/View";
import AuthorProfile from "./components/AuthorProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import Communities from "./components/Communities";
import Followers from "./components/Followers";
import Following from "./components/Following";

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function DashboardLayout() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[250px_1fr]">
      <DashboardHeader />

      <main className="w-full min-w-0">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="communities" element={<Communities />} />
            <Route path="create" element={<CreatePost />} />
            <Route path="MyPost" element={<MyPosts />} />
            <Route path="explore" element={<Explore />} />
            <Route path="profile" element={<Profile />} />
            <Route path="view/:id" element={<ViewPost />} />
            <Route path="edit/:id" element={<EditPost />} />
            <Route path="author/:id" element={<AuthorProfile />} />
            <Route path="author/:id/followers" element={<Followers />} />
            <Route path="author/:id/following" element={<Following />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
