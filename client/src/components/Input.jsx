export default function Input({ ...props }) {
  return (
    <input
      className="border border-slate-700 px-3 rounded-md shadow-md w-[24rem] h-12 sm:w-[28rem] sm:h-14"
      {...props}
    />
  );
}
