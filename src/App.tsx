import { useEffect } from 'react';
import ReactGa from 'react-ga4';
import { useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Header from './components/header/Header';
import { AppRoutes } from './routes';
import './App.scss';
import ErrorBoundary from './components/errorBoundary/ErrorBoundary';
import { useSelector } from 'react-redux';
import { getIsLoggedInSelector } from './store/user/selectors';
import TermsAndConditions from './containers/terms/TermsAndConditions';
import useAppTypeConfigs from './hooks/appTypeBasedConfigs';
import { appEnv } from './config/env';

const App = () => {
  const loggedIn = useSelector(getIsLoggedInSelector);
  const { pathname } = useLocation();
  const gaTrackId = appEnv.googleAnalyticsTrackingId;
  const { isCommunity } = useAppTypeConfigs();

  useEffect(() => {
    if (gaTrackId) {
      ReactGa.initialize(gaTrackId);

      /**
       * to report the page view
       * pathname is the current url location pathname
       */
      ReactGa.send({ hitType: 'pageview', page: pathname });
    }
  }, [gaTrackId, pathname]);

  return (
    <div className='app-container'>
      {loggedIn ? <Header /> : null}
      <div className={`app-body ${loggedIn ? 'logged-in' : ''}`}>
        <ErrorBoundary pathname={pathname}>
          <AppRoutes />
          {loggedIn && !isCommunity ? <TermsAndConditions /> : <></>}
        </ErrorBoundary>
      </div>
      <ToastContainer />
    </div>
  );
};

export default App;
