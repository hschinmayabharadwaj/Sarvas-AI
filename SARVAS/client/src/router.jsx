import { useEffect, useState } from 'react';

// Minimal pushState router (no dependency).
export function navigate(to) {
  window.history.pushState({}, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

// initial: the request path when rendering on the server (no window there).
export function usePath(initial) {
  const [path, setPath] = useState(() => initial ?? window.location.pathname);
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  return path;
}

export function match(path) {
  let m;
  if ((m = path.match(/^\/repos\/([^/]+)\/([^/]+)\/?$/))) {
    return { page: 'repo', owner: decodeURIComponent(m[1]), name: decodeURIComponent(m[2]) };
  }
  if ((m = path.match(/^\/changes\/([^/]+)\/?$/))) return { page: 'proposal', id: decodeURIComponent(m[1]) };
  if ((m = path.match(/^\/tasks\/([^/]+)\/?$/))) return { page: 'task', id: decodeURIComponent(m[1]) };
  if (path === '/tasks') return { page: 'tasks' };
  if (path === '/activity') return { page: 'activity' };
  if (path === '/admin') return { page: 'admin' };
  if (path === '/privacy') return { page: 'privacy' };
  if (path === '/') return { page: 'home' };
  return { page: 'notFound' };
}

export function Link({ to, children, className }) {
  return (
    <a href={to} className={className} onClick={(e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      navigate(to);
    }}>{children}</a>
  );
}
