export default function Button({ children, bgColor, ...props }) {
  return (
    <button
      {...props}
      className={`${bgColor} text-white p-2 w-[24rem] h-12 rounded-md hover:opacity-95 disabled:opacity-70 mt-3 sm:w-[28rem] sm:h-14`}
    >
      {children}
    </button>
  );
}
