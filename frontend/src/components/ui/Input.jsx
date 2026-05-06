export default function Input(props) {
  return (
    <input
      {...props}
      className={`
        w-full p-3 rounded-xl
        bg-white/60 dark:bg-white/5
        border border-slate-200/60 dark:border-white/10
        text-slate-800 dark:text-slate-100
        placeholder:text-slate-400
        outline-none
        focus:ring-2 focus:ring-blue-500
        transition
        ${props.className || ""}
      `}
    />
  );
}