import { FaSearch } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    } else {
      setSearchTerm("");
    }
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <header className="bg-indigo-300 shadow-md">
      <div className="flex justify-between max-w-6xl mx-auto p-4">
        <Link
          to="/"
          className="flex items-center"
        >
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap items-center">
            <span className="text-orange-500">Food</span>
            <span className="text-purple-500">Palette</span>
          </h1>
        </Link>
        <form
          action=""
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center justify-center"
        >
          <input
            className="
                bg-transparent
                focus:outline-none
                w-24 sm:w-64
                "
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            placeholder="검색..."
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="flex gap-4 items-center">
          <Link to="/">
            <li className="hidden sm:inline hover:underline text-slate-700">
              Home
            </li>
          </Link>
          {/* <Link to="/about">
            <li className="hidden sm:inline hover:underline text-slate-700">
              About
            </li>
          </Link> */}
          <Link to="/profile">
            {currentUser ? (
              <div>{currentUser.name}</div>
            ) : (
              <li className="hover:underline text-slate-700">로그인</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
