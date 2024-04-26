import { useSelector } from "react-redux";

import Input from "../components/Input";
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const { currentUser } = useSelector((state) => state.user);
  const currentUserData = currentUser.data;

  return (
    <div className="text-center mt-5 ">
      <h1 className="font-bold text-3xl sm:text-4xl mb-10">Profile</h1>
      <form className="flex flex-col items-center">
        <img
          className="w-[6rem] h-[6rem] sm:w-[8rem] sm:h-[8rem] rounded-full border shadow-md"
          src={currentUserData.avatar}
          alt="Avatar"
        />
        <div className="flex flex-col space-y-4 mt-10">
          <Input type="text" defaultValue={currentUserData.username} />
          <Input type="email" defaultValue={currentUserData.email} />
          <Input type="password" />
        </div>
        <button className="bg-slate-700 text-white p-2 w-[24rem] h-12 rounded-md hover:opacity-95 disabled:opacity-70 mt-4 sm:w-[28rem] sm:h-14">
          Update
        </button>
      </form>
      <div className="flex justify-between px-14 mt-2 sm:justify-center sm:mx-auto sm:space-x-[20.5rem] sm:max-w-max">
        <p className="text-red-700 text-sm font-semibold hover:opacity-70">
          <Link>Delete User</Link>
        </p>
        <p className="text-red-700 text-sm font-semibold hover:opacity-70">
          <Link>Signout</Link>
        </p>
      </div>
    </div>
  );
}
