import { FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

import { numberFormatter } from "../utils/numberFormatter";

export default function ListingItem({ listing }) {
  return (
    <div className="shadow-md hover:shadow-lg bg-white overflow-hidden transition rounded-md sm:w-[330px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          className="h-[320px] md:h-[200px] w-full object-cover hover:scale-105 transition transform duration-300 ease-in-out"
          src={listing.imageUrls[0]}
          alt="Listing Cover"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="font-bold text-lg truncate">{listing.name}</p>
          <div className="flex items-center gap-2 text-start text-md">
            <FaMapMarkerAlt className="text-green-500" />
            <p className="font-semibold truncate">{listing.address}</p>
          </div>
          <p className="line-clamp-4">{listing.description}</p>
          <p className="font-semibold text-lg text-slate-600">
            {listing.offer
              ? numberFormatter.format(listing.discountedPrice)
              : numberFormatter.format(listing.regularPrice)}
            {listing.type === "rent" && "/month"}
          </p>
          <div className="flex gap-4 font-semibold">
            <p>
              {listing.bedrooms} Bed{listing.bedrooms > 1 && "s"}
            </p>
            <p>
              {listing.bathrooms} Bath{listing.bathrooms > 1 && "s"}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
