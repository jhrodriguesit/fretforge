import { useEffect, useState } from 'react';

const readRoute = (): string => (window.location.hash || '#/').slice(2);

export const useHashRoute = (): string => {
  const [route, setRoute] = useState<string>(readRoute);
  useEffect(() => {
    const onHash = () => setRoute(readRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return route;
};

export const navTo = (path: string): void => {
  window.location.hash = '#/' + path;
};
