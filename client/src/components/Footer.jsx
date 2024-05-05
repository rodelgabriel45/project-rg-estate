import { Link } from "react-router-dom";

import { FaHome } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { FaSquareXTwitter } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";

export default function Footer() {
  return (
    <div className="bg-[#16351c] flex flex-wrap md:justify-between w-full gap-10 p-7 lg:px-24 bottom-0 text-white">
      <div className="max-w-28 md:max-w-64 flex flex-col gap-3">
        <h2 className="font-bold text-xl md:text-3xl">
          <span className="text-[#A3EBB1]">RG</span>Estate
        </h2>
        <p className="text-xs md:text-lg text-gray-400">
          Your Dream Home Awaits, Just a Click Away. Streamlining Your Property
          Journey for Speed, Trust, and Ease.
        </p>
      </div>
      <div className="max-w-12 flex flex-col gap-3">
        <h2 className="font-bold text-lg md:text-2xl">Products</h2>
        <ul className="text-gray-400">
          <li className="text-sm md:text-xl hover:text-[#A3EBB1]">
            <Link to={"/about"}>About</Link>
          </li>
          <li className="text-sm md:text-xl hover:text-[#A3EBB1]">
            <Link to={"/home"}>Home</Link>
          </li>
          <li className="text-sm md:text-xl hover:text-[#A3EBB1]">
            <Link to={"/search"}>Properties</Link>
          </li>
        </ul>
      </div>
      <div className="max-w-44 md:max-w-72 flex flex-col gap-3">
        <h2 className="font-bold text-lg md:text-2xl">Contact</h2>
        <ul className="flex flex-col gap-2 text-gray-400">
          <li className="flex items-center gap-2">
            <FaHome className="md:text-xl" />
            <p className="text-xs md:text-xl">Quezon City, Philippines</p>
          </li>
          <li className="flex items-center gap-2">
            <MdEmail className="md:text-xl" />
            <p className="text-xs md:text-xl">rodelgabriel45@gmail.com</p>
          </li>
          <li className="flex items-center gap-2">
            <FaPhoneAlt className="md:text-xl" />
            <p className="text-xs md:text-xl">+63 9563 324 685</p>
          </li>
        </ul>
      </div>
      <div className="max-w-32 md:max-w-72 lg:flex lg:flex-col gap-3">
        <h2 className="font-bold text-lg md:text-2xl">Follow Us</h2>
        <div className="text-2xl flex gap-2 text-gray-400">
          <FaFacebook className="cursor-pointer hover:text-[#A3EBB1]" />
          <AiFillInstagram className="cursor-pointer hover:text-[#A3EBB1]" />
          <FaSquareXTwitter className="cursor-pointer hover:text-[#A3EBB1]" />
          <SiGmail />
        </div>
      </div>
    </div>
  );
}
