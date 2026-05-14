import { action } from '@storybook/addon-actions';

export const useRouter = () => ({
  push: action('router.push'),
  replace: action('router.replace'),
  prefetch: action('router.prefetch'),
  back: action('router.back'),
  forward: action('router.forward'),
  refresh: action('router.refresh'),
});

export const useSearchParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    get: (key) => params.get(key),
    getAll: (key) => params.getAll(key),
    has: (key) => params.has(key),
    forEach: (cb) => params.forEach(cb),
    entries: () => params.entries(),
    keys: () => params.keys(),
    values: () => params.values(),
    toString: () => params.toString(),
  };
};

export const usePathname = () => window.location.pathname;

export const useParams = () => ({});

export const useSelectedLayoutSegment = () => null;
export const useSelectedLayoutSegments = () => [];
