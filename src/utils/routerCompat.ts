import { useRef } from 'react';
import { useLocation, useNavigate, useParams, matchPath as reactRouterMatchPath, type Location } from 'react-router-dom';

type NavigationTarget =
  | string
  | {
      pathname?: string;
      search?: string;
      hash?: string;
      state?: unknown;
    };

type LegacyMatchPathOptions =
  | string
  | {
      path?: string;
      exact?: boolean;
    };

export interface HistoryLike {
  location: Location;
  push: (to: NavigationTarget) => void;
  replace: (to: NavigationTarget) => void;
  goBack: () => void;
}

export interface RouteMatchLike<Params extends Record<string, string | undefined> = Record<string, string | undefined>> {
  params: Params;
  path: string;
  url: string;
  isExact: boolean;
}

export interface RouteComponentPropsLike<
  Params extends Record<string, string | undefined> = Record<string, string | undefined>,
> {
  history: HistoryLike;
  location: Location;
  match: RouteMatchLike<Params>;
}

const navigateTo = (navigate: ReturnType<typeof useNavigate>, to: NavigationTarget, replace = false) => {
  if (typeof to === 'string') {
    navigate(to, { replace });
    return;
  }

  navigate(
    {
      pathname: to.pathname || '',
      search: to.search || '',
      hash: to.hash || '',
    },
    {
      replace,
      state: to.state,
    }
  );
};

export const useHistoryCompat = (): HistoryLike => {
  const navigate = useNavigate();
  const location = useLocation();
  const historyRef = useRef<HistoryLike | null>(null);

  if (!historyRef.current) {
    historyRef.current = {
      location,
      push: (to: NavigationTarget) => navigateTo(navigate, to),
      replace: (to: NavigationTarget) => navigateTo(navigate, to, true),
      goBack: () => navigate(-1),
    };
  }

  historyRef.current.location = location;

  return historyRef.current;
};

export const matchPathCompat = <Params extends Record<string, string | undefined> = Record<string, string | undefined>>(
  pathname: string,
  options: LegacyMatchPathOptions
): RouteMatchLike<Params> | null => {
  const path = typeof options === 'string' ? options : options.path || '';
  const exact = typeof options === 'string' ? false : Boolean(options.exact);
  const matched = reactRouterMatchPath({ path, end: exact }, pathname);

  if (!matched) {
    return null;
  }

  return {
    params: matched.params as Params,
    path,
    url: matched.pathname,
    isExact: pathname === matched.pathname,
  };
};

export const useRouteComponentProps = <
  Params extends Record<string, string | undefined> = Record<string, string | undefined>,
>(
  path: string,
  exact = true
): RouteComponentPropsLike<Params> => {
  const location = useLocation();
  const history = useHistoryCompat();
  const params = useParams() as Params;
  const matched = matchPathCompat<Params>(location.pathname, { path, exact });

  return {
    history,
    location,
    match: matched || {
      params,
      path,
      url: location.pathname,
      isExact: false,
    },
  };
};
