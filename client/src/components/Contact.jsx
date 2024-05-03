import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [agent, setAgent] = useState(null);
  const [message, setMessage] = useState();

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const response = await fetch(`/api/user/${listing.userRef}`);
        const resData = await response.json();

        if (resData.success === false) {
          console.log(resData);
          return;
        }

        setAgent(resData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAgent();
  }, [listing.userRef]);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div>
      {agent && (
        <div className="flex flex-col mt-7 space-y-3">
          <p>
            Contact <span className="font-semibold">{agent.username} </span> for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}.</span>
          </p>
          <textarea
            onChange={(e) => handleChange(e)}
            className="resize-none border w-[28rem] md:w-[50rem] h-20 p-2"
            value={message}
            name="message"
            id="message"
            cols="22"
            placeholder="Enter your message..."
          ></textarea>
          <Link
            className="bg-slate-700 text-white p-3 rounded-md text-center hover:opacity-85 shadow-md"
            to={`mailto:${agent.email}?subject=Inquiry about ${listing.name}&body=${message}`}
          >
            Send Message
          </Link>
        </div>
      )}
    </div>
  );
}
