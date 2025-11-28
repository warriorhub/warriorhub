'use client';

import { useRouter } from 'next/navigation';

type BackLinkProps = {
  label?: string;
  fallbackHref?: string;
};

export default function BackLink({ label = '← Back', fallbackHref = '/search' }: BackLinkProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="btn btn-link p-0 text-decoration-none"
    >
      {label}
    </button>
  );
}

BackLink.defaultProps = {
  label: '← Back',
  fallbackHref: '/search',
};
