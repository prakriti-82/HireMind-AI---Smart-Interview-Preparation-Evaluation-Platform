export default function Card({ children, className = "" }) {
  return (
    <div
      className={`
        bg-white/70 dark:bg-white/5
        backdrop-blur-xl
        border border-slate-200/40 dark:border-white/10
        rounded-2xl
        p-5
        shadow-sm
        hover:shadow-xl
        hover:-translate-y-1
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
}