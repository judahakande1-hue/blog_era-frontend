import { Link } from "react-router-dom";
function Home() {
  return (
    <div className="bg-gray-400 h-full pt-15 ">
      <div className="sm:block lg:min-h-screen lg:grid grid-cols-2 px-7">
        <div>
          <h1 className="text-7xl font-medium bg-linear-to-l  mt-20 font-['JetBrains']">
            Welcome to <br /> BlogEra
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mt-10 mb-8 max-w-xl">
            Explore powerful articles, fresh perspectives, and inspiring content
            every day.
          </p>

          <Link
            to="/signup"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded mt-5 cursor-pointer active:scale-95 hover:bg-purple-700 transition"
          >
            Start Reading
          </Link>
        </div>

        <div>
          <img src="/pen.png" className="mt-7 md:mt-15 w-80 md:w-full" alt="" />
        </div>
      </div>

      <div className="col-span-2 text-center border-t-2 p-2 border-black mt-5">
        <h1>@ 2026 BlogEra</h1>
      </div>
    </div>
  );
}

export default Home;
