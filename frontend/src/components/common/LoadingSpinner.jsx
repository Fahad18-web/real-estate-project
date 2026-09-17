export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div
        className={`${sizeClasses[size]} border-[#6C63FF]/30 border-t-[#6C63FF] rounded-full animate-spin`}
      />
      {text && <p className="text-sm text-[#9090B0] font-medium">{text}</p>}
    </div>
  );
}
