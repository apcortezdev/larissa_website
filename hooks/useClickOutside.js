import { useEffect } from 'react';

export const useClickOutside = (ref, onClick) => {
  useEffect(() => {
    if (!ref?.current) {
      return;
    }
    const handleClickOutside = (e) => {
      if (onClick && !ref.current.contains(e.target)) {
        onClick(e);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, onClick]);
};
