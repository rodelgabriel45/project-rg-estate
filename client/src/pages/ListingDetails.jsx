import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

export default function ListingDetailsPage() {
  SwiperCore.use([Navigation]);
  const [listingDetails, setListingDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const listingId = params.listingId;

  useEffect(() => {
    const fetchListingDetails = async () => {
      setLoading(true);
      const response = await fetch(`/api/listing/get/${listingId}`);

      const resData = await response.json();

      if (resData.success === false) {
        console.log(resData);
        setLoading(false);
        return;
      }

      setLoading(false);
      setListingDetails(resData);
    };

    fetchListingDetails();
  }, []);

  return (
    <main>
      {loading && (
        <p className="text-center my-10 text-2xl font-bold">
          Loading listing details...
        </p>
      )}
      {listingDetails && !loading && (
        <>
          <Swiper navigation>
            {listingDetails?.imageUrls?.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[700px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </main>
  );
}
