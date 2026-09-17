import { useEffect, useState } from 'react';

const getInitials = (name) => {
  if (!name) return 'EP';

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  const initials = parts.map((part) => part[0]).join('').toUpperCase();
  return initials || 'EP';
};

export default function ProfileAvatar({ src, alt, name, className = '' }) {
  const [imageError, setImageError] = useState(false);
  const hasImage = Boolean(src) && !imageError;
  const initials = getInitials(name || alt);

  useEffect(() => {
    setImageError(false);
  }, [src]);

  if (hasImage) {
    return (
      <img
        src={src}
        alt={alt || name || 'Profile avatar'}
        onError={() => setImageError(true)}
        className={`${className} object-cover`}
      />
    );
  }

  return (
    <div
      className={`${className} flex items-center justify-center bg-linear-to-tr from-[#6C63FF]/20 via-(--bg-elevated) to-[#4ECDC4]/20 border border-(--border-default) text-(--text-primary) font-bold tracking-wide`}
      aria-label={alt || name || 'Profile avatar'}
    >
      {initials}
    </div>
  );
}