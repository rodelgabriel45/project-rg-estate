import { Link } from "react-router-dom";
import ListingItem from "./ListingItem";

export default function RecentListings({ listings, text, type }) {
  let linkTo;

  if (type === "offer") {
    linkTo = "offer=true";
  } else if (type === "sale") {
    linkTo = "type=sale";
  } else {
    linkTo = "type=rent";
  }

  return (
    <div className="flex flex-col max-w-[90rem] mx-auto p-4 gap-8 my-10">
      {listings && listings.length > 0 && (
        <div>
          <div className="my-4">
            <h2 className="font-bold text-2xl lg:text-3xl text-slate-700">
              Recent {text}
            </h2>
            <Link
              to={`/search?${linkTo}`}
              className="text-blue-700 text-sm lg:text-lg hover:opacity-75"
            >
              Show more {text}..
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:gap-4">
            {listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
