import aboutImg from "../assets/about-bg.jpg";

export default function AboutPage() {
  return (
    <div>
      <img
        src={aboutImg}
        alt="About Image"
        className=" lg:h-[550px] w-full object-cover"
      />
      <div className="flex flex-col lg:flex-row lg:items-start py-20 px-10 lg:justify-center gap-20 min-h-screen">
        <div className="flex flex-col items-center gap-12">
          <div className="flex flex-col gap-4 text-slate-700 max-w-3xl">
            <span className="font-bold text-2xl lg:text-4xl">Mission:</span>{" "}
            <p className="lg:text-2xl">
              At <span className="font-bold">RGEstate</span>, our mission is to
              simplify the real estate journey for our clients. We believe in
              providing fast, easy, and reliable solutions that streamline the
              buying, selling, and renting process. By leveraging cutting-edge
              technology and a commitment to exceptional service, we aim to
              empower individuals and families to find their dream properties
              quickly and hassle-free.
            </p>
          </div>

          <div className="flex flex-col gap-4 text-slate-700 max-w-3xl">
            <span className="font-bold text-2xl lg:text-4xl">Vision:</span>{" "}
            <p className="lg:text-2xl">
              Our vision is to revolutionize the real estate industry by making
              property transactions more accessible and efficient than ever
              before. We envision a future where anyone can navigate the
              complexities of real estate with ease, whether they're first-time
              buyers or seasoned investors. Through our innovative platform, we
              strive to be the go-to destination for all your real estate needs,
              offering unmatched convenience and reliability at every step of
              the journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
