import ReactGA from 'react-ga4';

export const trackGoogleAnalyticsEvent = (
  category: string,
  eventName: string,
  route: string,
  data: Record<string, any>
) => {
  const eventParams = {
    category,
    route,
    eventName,
    ...data
  };
  ReactGA.event({ ...eventParams, category: data.suite_name, action: 'landing_page', label: data.suite_name });
};
