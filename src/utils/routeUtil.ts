/**
 *
 * This method used for go to specific application based on url
 *
 * @param {string} url The URL used for go to specific website.
 */
export const goToUrl = (url: any = '/') => {
  window.location.replace(url);
};
