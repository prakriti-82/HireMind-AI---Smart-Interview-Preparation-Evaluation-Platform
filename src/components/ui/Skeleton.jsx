export default function Skeleton({ className = "" }) {
  return (
    <div
      className={`
        animate-pulse
        bg-slate-200/60 dark:bg-white/10
        rounded-xl
        ${className}
      `}
    />
  );
}