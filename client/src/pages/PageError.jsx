import { useSelector } from "react-redux";
import { useRouteError, Link } from "react-router-dom";

export default function PageError() {
  const { currentUser } = useSelector((state) => state.user);
  const error = useRouteError();

  return (
    <div className="p-6">
      <h1 className="font-extrabold text-4xl underline underline-offset-4">
        {error.status} {error.statusText}
      </h1>
      <p className="mt-4">{error.data}</p>
      <div>
        <h2 className="font-semibold mt-10 border-t pt-2">
          To get started. Go to:
        </h2>
        <ul className="flex flex-col text-md sm:text-lg space-y-2 mt-4">
          <li className="hover:text-amber-500 hover:underline hover:underline-offset-4">
            <Link to={"/"}>Home</Link>
          </li>
          <li className="hover:text-amber-500 hover:underline hover:underline-offset-4">
            <Link to={"/about"}>About</Link>
          </li>
          <li className="hover:text-amber-500 hover:underline hover:underline-offset-4">
            <Link to={currentUser?.data ? "/profile" : "/sign-in"}>
              Sign In
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
