import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const currentUserData = currentUser?.data;

  const profileImg = (
    <img
      className="rounded-full w-10 h-10 object-cover"
      src={currentUserData?.avatar}
      alt="Avatar"
    />
  );

  return (
    <header>
      <nav className="flex justify-between px-8 sm:px-20 py-4 mx-auto bg-green-800 text-white">
        <h1 className="font-bold text-2xl sm:text-3xl">
          <Link>Logo</Link>
        </h1>
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
