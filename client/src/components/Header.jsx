import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const currentUserData = currentUser?.data;
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const profileImg = (
    <img
      className="rounded-full w-10 h-10 object-cover"
      src={currentUserData?.avatar}
      alt="Avatar"
    />
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromURL = urlParams.get("searchTerm");

    if (searchTermFromURL) {
      setSearchTerm(searchTermFromURL);
    }
  }, [window.location.search]);

  return (
    <header>
      <nav className="flex justify-between items-center px-8 sm:px-20 py-4 mx-auto bg-green-800 text-white">
        <h1 className="font-bold text-2xl sm:text-3xl">
          <Link>Logo</Link>
        </h1>
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="flex items-center relative"
        >
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Search..."
            className="text-black rounded-md p-3 focus:outline-none w-32 sm:ms-10 sm:w-64 lg:w-[30rem] shadow-md"
          />
          <button>
            <FaSearch className="absolute right-0 top-4 md:top-3 mr-4 text-lg md:text-2xl text-blue-700 hover:opacity-80" />
          </button>
        </form>
        <ul className="flex text-lg sm:text-xl space-x-4 items-center">
          <li className="hover:text-amber-500 hover:underline hover:underline-offset-4">
            <Link to={"/"}>Home</Link>
          </li>
          <li className="hover:text-amber-500 hover:underline hover:underline-offset-4">
            <Link to={"/about"}>About</Link>
          </li>
          <li className="hover:text-amber-500 hover:underline hover:underline-offset-4">
            <Link to={currentUser?.data ? "/profile" : "/sign-in"}>
              {currentUser?.data ? profileImg : "Sign In"}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
